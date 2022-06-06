/**
 * @Date: 2019-08-01T16:08:64+02:00
 * @flow
**/

import { type IsoDateString } from '../../Common/Types'

export const scheduleNotificationIntervals = {
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  WEEK: 'week',
}

export type ScheduleNotificationInterval = $Values<typeof scheduleNotificationIntervals>

export type FmcTokenRecord = $Exact<{
  _id: IsoDateString,
  dateCreated: IsoDateString,
  deviceUUID: string,
  fmcToken: string,
  lastAppUse: IsoDateString,
  notificationPermissionsAllowed: ?boolean,
}>

export const displayUnits = {
  PHYSICAL: 'physical',
  PRICE: 'price',
}

export type DisplayUnit = $Values<typeof displayUnits>
