// @flow
import type { ConfirmationMailData } from '../Model/Types'

const PREFIX = 'referral'

const CLEAR_APP_REFERRED_BY = `${PREFIX}/CLEAR_APP_REFERRED_BY`

const SET_APP_REFERRED_BY = `${PREFIX}/SET_APP_REFERRED_BY`

const SET_CONFIRMATION_MAIL_DATA = `${PREFIX}/SET_CONFIRMATION_MAIL_DATA`

const SET_MAIL = `${PREFIX}/SET_MAIL`

const CLEAR_EMAIL = `${PREFIX}/CLEAR_EMAIL`

const SET_FREE_METERS_COUNT = `${PREFIX}/SET_FREE_METERS_COUNT`

const SET_MAIL_CONFIRMED = `${PREFIX}/SET_MAIL_CONFIRMED`

const SET_REFERRAL_ID = `${PREFIX}/SET_REFERRAL_ID`

const SET_REFERRAL_METERS_COUNT = `${PREFIX}/SET_REFERRAL_METERS_COUNT`

const SET_REFERRED_BY = `${PREFIX}/SET_REFERRED_BY`

const SET_REFERRAL_ERROR = `${PREFIX}/SET_REFERRAL_ERROR`

export type SetConfirmationMailData = { payload: ConfirmationMailData, type: typeof SET_CONFIRMATION_MAIL_DATA }

export type SetAppReferredBy = { payload: ?string, type: typeof SET_APP_REFERRED_BY }

export type SetFreeMetersCount = { payload: number, type: typeof SET_FREE_METERS_COUNT }

export type SetMail = { payload: string, type: typeof SET_MAIL }

export type SetMailConfirmed = { type: typeof SET_MAIL_CONFIRMED }

export type SetReferralId = { payload: string, type: typeof SET_REFERRAL_ID }

export type SetReferralMetersCount = { payload: number, type: typeof SET_REFERRAL_METERS_COUNT }

export type SetReferredBy = { payload: string, type: typeof SET_REFERRED_BY }

export type SetReferralError = { payload: string, type: typeof SET_REFERRAL_ERROR }

export const actionsTypes = Object.freeze({
  CLEAR_APP_REFERRED_BY,
  CLEAR_EMAIL,
  SET_APP_REFERRED_BY,
  SET_CONFIRMATION_MAIL_DATA,
  SET_FREE_METERS_COUNT,
  SET_MAIL,
  SET_MAIL_CONFIRMED,
  SET_REFERRAL_ERROR,
  SET_REFERRAL_ID,
  SET_REFERRAL_METERS_COUNT,
  SET_REFERRED_BY,
})

export type ActionsTypes = $Values<typeof actionsTypes>
