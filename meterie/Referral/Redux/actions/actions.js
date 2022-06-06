// @flow
import {
  Share,
} from 'react-native'
import { createAction } from 'redux-actions'
import {
  type Dispatch,
  type GetState,
} from 'redux-thunk'

import { type State as ReduxState } from '../../../../Redux/Types'
import { I18n } from '../../../Common/I18n'
import { Log } from '../../../Common/Log'
import { createReferralLink } from '../../Model/Helpers'
import { actionsTypes } from '../actionTypes'

const logger = new Log('Referral.Redux.actions.index')

export const shareWithPromocode = () => async (dispatch: Dispatch<*>, getState: GetState<ReduxState>) => {
  const state = getState()
  const referralId = state.referral.referralId

  if (referralId) {
    const referralLink = await createReferralLink(referralId)

    Share.share({
      message: referralLink,
      title: I18n.t('referral.actions.title.SHARE_APP'),
    }).catch(err => {
      // TODO: add log
      logger.log(err)
    })
  }
}

export const setFreeMetersCount = createAction<typeof actionsTypes.SET_FREE_METERS_COUNT, *, *>(actionsTypes.SET_FREE_METERS_COUNT)
