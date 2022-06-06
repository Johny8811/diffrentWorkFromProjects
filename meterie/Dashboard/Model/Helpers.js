// @flow
import firebase, {
  type Notification,
} from 'react-native-firebase'

import {
  getStoredFmcTokenRegistered,
  setStoredFmcTokenRegistered,
} from '../AsyncStorage'
import * as model from './Database'

export const getScheduledNotificationsIds = async () => {
  const scheduledNotifications: Notification[] = await firebase.notifications().getScheduledNotifications()

  return scheduledNotifications.map<string>((notification: Notification) => notification.notificationId)
}

export const registerAndSaveFMCToken = async () => {
  const fmcTokenSet = await getStoredFmcTokenRegistered()

  !fmcTokenSet && firebase.messaging().getToken().then((fmcToken: ?string) => {
    fmcToken && model.addFMCToken(fmcToken).then(result => {
      result.ok && setStoredFmcTokenRegistered(true)

      return result
    })

    return fmcToken
  })
}

export const checkIfExistLocalNotification = async (notificationId: string): Promise<?Notification> => {
  const localNotificatinos: Notification[] = await firebase.notifications().getScheduledNotifications()

  // TODO: Refrite using Array.find
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const wantedNotifications: Notification[] = []

  localNotificatinos.forEach((notification: Notification) => {
    if (notification.notificationId === notificationId) {
      wantedNotifications.push(notification)
    }
  })

  return wantedNotifications[0] ? wantedNotifications[0] : null
}
