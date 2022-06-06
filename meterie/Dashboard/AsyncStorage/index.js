/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-10-03T16:10:23+02:00
 * @Copyright: Martin Adamko
 * @flow
**/

import {
  getItem,
  setItem,
} from '../../Utils/AsyncStorage'
import * as constants from './constants'

async function getStoredFmcTokenRegistered () {
  return getItem(constants.FMC_TOKEN_REGISTERED_KEY)
}

async function setStoredFmcTokenRegistered (registered: boolean) {
  return setItem(constants.FMC_TOKEN_REGISTERED_KEY, registered)
}

async function getStoredAnalyticsId () {
  return getItem(constants.ANALYTICS_ID_KEY)
}

async function setStoredAnalyticsId (analyticsUserId: string) {
  return setItem(constants.ANALYTICS_ID_KEY, analyticsUserId)
}

export {
  getStoredFmcTokenRegistered,
  getStoredAnalyticsId,
  setStoredFmcTokenRegistered,
  setStoredAnalyticsId,
}
