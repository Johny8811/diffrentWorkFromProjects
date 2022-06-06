// @flow
import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'
import {
  type Dispatch,
  type GetState,
} from 'redux-thunk'

import Config from '../../../../Config'
import {
  analytics,
  setUpAnalytics,
} from '../../../../Config/AnalyticsConfig'
import { type State as ReduxState } from '../../../../Redux/Types'
import { withLoading } from '../../../../Redux/Utils'
import {
  I18n,
  Moment,
} from '../../../Common/I18n'
import { Log } from '../../../Common/Log'
import {
  getStoredAnalyticsId,
  setStoredAnalyticsId,
} from '../../../Dashboard/AsyncStorage'
import { multiGet } from '../../../Utils/AsyncStorage'
import { isEmailAlias } from '../../../Utils/EmailUtils'
import {
  APP_REFERRED_BY,
  getStoredUserEmail,
  REFERRAL_ID,
  REFERRED_BY,
  setStoredAppReferredBy,
  setStoredReferralId,
  setStoredReferredBy,
  setStoredUserEmail,
  USER_EMAIL,
} from '../../AsyncStorage'
import * as model from '../../Model/Database'
import type {
  ConfirmationMailData,
  Referral,
} from '../../Model/Types'
import { actionsTypes } from '../actionTypes'
import {
  EMAIL_SERVICE_URL,
  LOADING_KEYS,
  MAIL_API_KEY,
} from '../constants'
import {
  getAppReferredBy,
  getConfirmationMailData,
  getEmail,
} from '../selectors'

const inspector = new Log('Referral.Redux.actions.referral')

// ---------------- Set referral error ----------------
const setReferralError = createAction<typeof actionsTypes.SET_REFERRAL_ERROR, ?string>(actionsTypes.SET_REFERRAL_ERROR)

export const clearReferralError = () => (dispatch: Dispatch<*>) => {
  dispatch(setReferralError(null))
}
// ---------------- Send confirmation email and set his data to state ----------------
const setConfirmationMailDataAction = createAction<typeof actionsTypes.SET_CONFIRMATION_MAIL_DATA, ConfirmationMailData>(
  actionsTypes.SET_CONFIRMATION_MAIL_DATA
)

export const setEmailAction = createAction<typeof actionsTypes.SET_MAIL, ?string>(actionsTypes.SET_MAIL)

export const clearEmailAction = createAction<typeof actionsTypes.CLEAR_EMAIL, ?string>(actionsTypes.CLEAR_EMAIL)

export const resetEmail = () => withLoading(
  async (dispatch: Dispatch<*>) => {
    dispatch(batchActions([
      setEmailAction(null),
      setReferralError(null),
    ]))
  },
  LOADING_KEYS.send.confirmMail,
)

export const setAndSendConfirmMail = (email: string) => withLoading(
  async (dispatch: Dispatch<*>) => {
    const code = Math.random().toString().substr(2, 4)
    const expirationTime = Moment().add(__DEV__ ? 1 : 10, 'minutes')

    if (!Config.allowEmailAliases && isEmailAlias(email)) {
      dispatch(setReferralError(I18n.t('referral.referral.error.EMAIL_ALIASES_ARE_NOT_ALLOWED')))
      return
    }

    return fetch(`${EMAIL_SERVICE_URL}?code=${code}&email=${encodeURIComponent(email)}`, { headers: { 'X-Api-Key': MAIL_API_KEY } })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          dispatch(setReferralError(I18n.t('referral.referral.error.CONFIRMATION_EMAIL_SENT_FAILED')))
          if (res.stackTrace) {
            // TODO: Log stack trace
          }
        } else if (res.message) {
          dispatch(batchActions([
            setConfirmationMailDataAction({
              code,
              expirationTime,
            }),
            setEmailAction(email),
            setReferralError(null),
          ]))
        }

        return res // ?
      })
  },
  LOADING_KEYS.send.confirmMail,
)

// ---------------- Confirm email, check if can be confirmed or set error ----------------
export const setEmailConfirmAction = createAction<typeof actionsTypes.SET_MAIL_CONFIRMED, void>(actionsTypes.SET_MAIL_CONFIRMED)

const setErrorEmailExistAndClearEmail = () => (dispatch: Dispatch<*>) => {
  dispatch(setReferralError(I18n.t('referral.referral.error.USER_ALREADY_EXISTS')))
  dispatch(setEmailAction(null))
}

const clearErrorAndSetUserData = (email: string, referral: ?Referral) => async (dispatch: Dispatch<*>) => {
  const { referralId, referredBy } = referral || {}

  dispatch(setReferralError(null))

  await setStoredUserEmail(email)
  if (referralId) await setStoredReferralId(referralId)

  // TODO: this must be rewrited and for this moment that two lins must be set together, this must be remaked in component
  // if confirmatin email and referralId is set in two dispatch, new referralId is created, and that is bad
  const actionsList = [setEmailConfirmAction()]

  if (referralId) {
    actionsList.push(setReferralIdAction(referralId))
  }

  if (referredBy) {
    dispatch(setReferredBy(referredBy))
  }

  dispatch(batchActions(actionsList))
}

const canBeEmailConfirmedOrSetError = () => async (dispatch: Dispatch<*>, getState?: GetState<ReduxState>) => {
  const state = getState && getState()
  const email = state && getEmail(state)
  const appReferredBy = state && getAppReferredBy(state)

  if (email) {
    const referral: ?Referral = await model.fetchReferralByEmail(email)
    const referralAnalyticsUserId = referral ? referral.analyticsUserId : null

    if (referralAnalyticsUserId) {
      setUpAnalytics(referralAnalyticsUserId)
      setStoredAnalyticsId(referralAnalyticsUserId).catch(error => {
        inspector.log('Set analytics user id error: ', error)
      })
    } else {
      // TODO: this logic can be deleted after added all analytics user id to referrals in DB
      getStoredAnalyticsId()
        .then((analyticsUserId: ?string) => {
          analyticsUserId && model.addAnalyticsUserIdToExistingReferral(email, analyticsUserId)

          return analyticsUserId
        })
        .catch(error => {
          inspector.log('Get analytics user id error: ', error)
        })
    }

    if (referral && appReferredBy) {
      dispatch(setErrorEmailExistAndClearEmail())
    } else {
      dispatch(clearErrorAndSetUserData(email, referral))

      return true
    }
  }
}

export const confirmEmail = (enteredCode: string) => async (dispatch: Dispatch<*>, getState: GetState<ReduxState>) => {
  const state = getState()
  const confirmationMailData = getConfirmationMailData(state)
  const email = getEmail(state)
  const { code, expirationTime } = confirmationMailData || {}

  if (code === enteredCode && expirationTime && expirationTime.isAfter(Moment()) && email) {
    await dispatch(canBeEmailConfirmedOrSetError())
  } else {
    dispatch(setReferralError(I18n.t('referral.referral.error.CONFIRMATION_CODE_IS_NOT_VALID')))
  }
}

// ---------------- Create referral ID and set it to redux ----------------
export const setReferralIdAction = createAction<typeof actionsTypes.SET_REFERRAL_ID, string>(actionsTypes.SET_REFERRAL_ID)

export const createReferralId = () => withLoading(
  async (dispatch: Dispatch<*>, getState?: GetState<ReduxState>) => {
    const state = getState && getState()
    const referral = state && state.referral
    const email = referral && referral.email
    const emailConfirmed = referral && referral.emailConfirmed
    const referredBy = referral && referral.referredBy
    let referralId = referral && referral.referralId

    if (email && emailConfirmed && !referralId && !referredBy) {
      try {
        referralId = await model.createReferral(email)

        await setStoredReferralId(referralId)

        dispatch(setReferralIdAction(referralId))

        analytics.logEvent('user_created_referral_with_referral_id', { referralId })
      } catch (e) {
        inspector.log('Create referral with "referralId" error: ', e)
      }
    } else if (email && emailConfirmed && !referralId && referredBy) {
      try {
        referralId = await model.updateReferralAddReferralId(email)

        await setStoredReferralId(referralId)

        dispatch(setReferralIdAction(referralId))

        analytics.logEvent('user_added_referral_id_to_existing_referral', { referralId })
      } catch (e) {
        inspector.log('Update referral and add "referralId" error: ', e)
      }
    } else {
      inspector.log('ERROR: Should not call set referral already created')
    }
  },
  LOADING_KEYS.fetch.promocodeId,
)

// ---------------- Persist, set and clear "AppReferredBy" ----------------
export const setAppReferredByAction = createAction<typeof actionsTypes.SET_APP_REFERRED_BY, ?string>(
  actionsTypes.SET_APP_REFERRED_BY
)

export const setAppReferredBy = (appReferredBy: string) => async (dispatch: Dispatch<*>) => {
  inspector.log('setAppReferredBy: ', { appReferredBy })

  await setStoredAppReferredBy(appReferredBy)
  dispatch(setAppReferredByAction(appReferredBy))
}

const clearAppReferredBeAction = createAction(actionsTypes.CLEAR_APP_REFERRED_BY) // TODO: deleted it from async storage too and rename to right name

// ---------------- Persist, set "ReferredBy" ----------------
export const setReferredByAction = createAction<typeof actionsTypes.SET_REFERRED_BY, string>(
  actionsTypes.SET_REFERRED_BY
)

export const setReferredBy = (referredBy: string) => async (dispatch: Dispatch<*>) => {
  inspector.log('setReferredBy: ', { referredBy })

  await setStoredReferredBy(referredBy)
  dispatch(setReferredByAction(referredBy))
}

// ---------------- Persist, set "ReferredBy" ----------------
export const setNewReferrer = () => async (dispatch: Dispatch<*>, getState?: GetState<ReduxState>) => {
  const state = getState && getState()
  const email = state && state.referral && state.referral.email
  const emailConfirmed = state && state.referral && state.referral.emailConfirmed
  const referredBy = state && state.referral && state.referral.referredBy
  const appReferredBy = state && state.referral && state.referral.appReferredBy

  if (!referredBy && email && emailConfirmed && appReferredBy) {
    inspector.log('setNewReferrer: ', {
      appReferredBy,
      email,
      emailConfirmed,
      referredBy,
    })

    try {
      const referrerUpdated = await model.updateReferralReferresByReferralId(appReferredBy, email)

      inspector.log('referrerUpdated: ', { referrerUpdated })

      if (referrerUpdated) {
        await model.createReferralByReferrer(email, appReferredBy)

        // TODO: try to resolve dispatching thunk action with batch actions
        dispatch(setReferralError(null))
        dispatch(setReferredBy(appReferredBy))

        analytics.logEvent('user_used_own_promo_code_to_gain_free_meter')
        // TODO: check if this is needed
        // dispatch(clearAppReferredBeAction())
      } else {
        dispatch(batchActions([
          clearAppReferredBeAction(),
          setReferralError(I18n.t('referral.referral.error.NO_USER_WITH_THAT_REFERRAL_ID_FOUND')),
        ]))
      }
    } catch (e) {
      inspector.log('Error while setting new referrer: ', e)
    }
  } else {
    inspector.log('Set app referred by error: email is not yet set')
  }
}

const setReferralMetersCountAction = createAction(actionsTypes.SET_REFERRAL_METERS_COUNT)

export const fetchReferralMetersCount = () => async (dispatch: Dispatch<*>) => {
  const email = await getStoredUserEmail()
  const metersCount: ?number = email ? await model.fetchReferralMetersCount(email) : null

  metersCount && dispatch(setReferralMetersCountAction(metersCount))
}

export const setUpUserDataOnLaunch = () => async (dispatch: Dispatch<*>) => {
  const [
    appReferredBy,
    referredBy,
    referralId,
    userEmail,
  ] = await multiGet(
    APP_REFERRED_BY,
    REFERRED_BY,
    REFERRAL_ID,
    USER_EMAIL,
  )

  const actionsList = []

  if (userEmail) {
    actionsList.push(setEmailAction(userEmail))
    actionsList.push(setEmailConfirmAction())

    if (referralId) {
      actionsList.push(setReferralIdAction(referralId))
    }

    if (referredBy) {
      actionsList.push(setReferredByAction(referredBy))
    }
  }

  if (appReferredBy) {
    actionsList.push(setAppReferredByAction(appReferredBy))
  }

  dispatch(batchActions(actionsList))
  dispatch(fetchReferralMetersCount())
}
