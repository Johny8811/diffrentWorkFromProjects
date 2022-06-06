/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-29T12:01:51+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import {
  features,
  isFeatureEnabled,
} from '../../../../Config/FeatureAccess'
import { remindMePeriods } from '../../../Meters/Model/Types'

export const getNotificationIntervalAndFireDate = (interval: ?$Keys<typeof remindMePeriods>): ?{
  fireDate: number,
  repeatInterval: string,
} => {
  const intervalObject = {
    fireDate: 0,
    repeatInterval: 'minute',
  }
  const day = 86400000

  const testingIsEnabled = __DEV__ || isFeatureEnabled(features.SHORT_NOTIFICATIONS_INTERVAL)

  switch (interval) {
    case remindMePeriods.EVERY_DAY: {
      if (!testingIsEnabled) {
        intervalObject.fireDate = new Date(Date.now() + day).getTime()
        intervalObject.repeatInterval = 'day'
      }

      return intervalObject
    }

    case remindMePeriods.EVERY_WEEK: {
      if (!testingIsEnabled) {
        intervalObject.fireDate = new Date(Date.now() + day * 7).getTime()
        intervalObject.repeatInterval = 'week'
      }

      return intervalObject
    }

    case remindMePeriods.EVERY_MONTH: {
      if (!testingIsEnabled) {
        intervalObject.fireDate = new Date(Date.now() + day * 30).getTime()
        intervalObject.repeatInterval = 'month'
      }

      return intervalObject
    }

    default: {
      return null
    }
  }
}
