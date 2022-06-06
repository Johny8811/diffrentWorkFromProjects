/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-10-04T04:10:88+02:00
 * @Copyright: Martin Adamko
 * @flow
**/

import {
  getItem,
  setItem,
} from '../../Utils/AsyncStorage'

export const APP_REFERRED_BY = 'APP_REFERRED_BY'
export const REFERRAL_ID = 'referral/REFERRAL_ID'
export const REFERRED_BY = 'REFERRED_BY'
export const USER_EMAIL = 'referral/USER_EMAIL'

export async function getStoredAppReferredBy () {
  return getItem(APP_REFERRED_BY)
}

export async function setStoredAppReferredBy (appReferredBy: string) {
  return setItem(APP_REFERRED_BY, appReferredBy)
}

export async function getStoredReferralId () {
  return getItem(REFERRAL_ID)
}

export async function setStoredReferralId (referralId: string) {
  return setItem(REFERRAL_ID, referralId)
}

export async function getStoredReferredBy () {
  return getItem(REFERRED_BY)
}

export async function setStoredReferredBy (referredBy: string) {
  return setItem(REFERRED_BY, referredBy)
}

export async function getStoredUserEmail () {
  return getItem(USER_EMAIL)
}

export async function setStoredUserEmail (email: string) {
  return setItem(USER_EMAIL, email)
}
