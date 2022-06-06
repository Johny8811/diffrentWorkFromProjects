// @flow
import firebase from 'react-native-firebase'
import { createAction } from 'redux-actions'
import {
  type Dispatch,
} from 'redux-thunk'

import Config from '../../../../Config'
import {
  I18n,
  Moment,
} from '../../../Common/I18n'
import { Log } from '../../../Common/Log'
import { remindMePeriods } from '../../../Meters/Model/Types'
import { getScheduledNotificationsIds } from '../../Model/Helpers'
import {
  type ScheduleNotificationInterval,
  scheduleNotificationIntervals,
} from '../../Model/Types'
import { actionTypes } from '../actionTypes'
import { NOTIFICATION_TO_USE_APP_ID } from '../constants'
import { getNotificationIntervalAndFireDate } from './Helpers'

const inspector = new Log('Dashboard.Redux.actions.pushNotifications')

// TODO: maybe call request for notification always here if has not permissions
export const addLocalNotification = ({
  notificationBody,
  notificationId,
  notificationTitle,
  scheduleInterval,
}: {
  notificationBody: string,
  notificationId: string,
  notificationTitle: string,
  scheduleInterval: ?{
    fireDate: number,
    repeatInterval: ScheduleNotificationInterval,
  },
}) => () => {
  inspector.log('addLocalNotification:', {
    notificationId,
    notificationTitle,
    scheduleInterval: {
      fireDate: scheduleInterval && scheduleInterval.fireDate,
      fireDateAsReadableFormat: scheduleInterval && Moment(scheduleInterval.fireDate).format('YYYY.MM.DD - HH:mm:ss'),
      repeatInterval: scheduleInterval && scheduleInterval.repeatInterval,
    },
  })

  const notification = new firebase.notifications.Notification()
    .android.setChannelId(Config.scanMeterAndroidChannels)
    .android.setAutoCancel(true)
    .setNotificationId(notificationId)
    .setTitle(notificationTitle)
    .setBody(notificationBody)
    .setData({ notificationId })
    .android.setSmallIcon(Config.androidNotificationsSmallIconResource)

  if (scheduleInterval) {
    firebase.notifications().scheduleNotification(notification, {
      fireDate: scheduleInterval.fireDate,
      repeatInterval: scheduleInterval.repeatInterval,
    })
  } else {
    firebase.notifications().displayNotification(notification)
  }
}

export const removeLocalNotification = (notificationId: string) => async () => {
  inspector.log('removeLocalNotification: ', { notificationId })

  try {
    return await firebase.notifications().cancelNotification(notificationId)
  } catch (e) {
    inspector.log('Error while removing local notification ', { notificationId })
  }
}

// -------------------- specific notifications --------------------
// TODO: clean actions, move it to appropriate location
export const addOrUpdateMeterLocalNotificationSchedule = ({
  interval,
  meterId,
  meterName,
}: {
  interval: ?$Keys<typeof remindMePeriods>,
  meterId: string,
  meterName: string,
}) =>
  (dispatch: Dispatch<*>) => {
    const scheduleInterval = getNotificationIntervalAndFireDate(interval)
    const transtaledNotificationText = I18n.tf('dashboard.pushNotifications.text.Meter_{}_should_be_measured_again', [meterName])

    dispatch(addLocalNotification({
      notificationBody: transtaledNotificationText,
      notificationId: meterId,
      notificationTitle: meterName,
      scheduleInterval,
    }))
  }

const setReminderToUseApp = createAction(actionTypes.SET_REMINDER_TO_USE_APP)

// TODO: for add notification must be initialize notifications for creating notification channel for android
export const addOrUpdateNotificationToUseApp = (
  moment: Moment,
  notificationTitle: string,
  notificationBody: string,
) => (dispatch: Dispatch<*>) => {
  const dateIsWithin24Hours = moment.isBefore(Moment().add(1, 'day')) // bug https://github.com/invertase/react-native-firebase/issues/2490

  dispatch(addLocalNotification({
    notificationId: NOTIFICATION_TO_USE_APP_ID,
    notificationTitle,
    notificationBody,
    scheduleInterval: {
      fireDate: __DEV__ ? Moment().add(1, 'minutes').valueOf() : moment.valueOf(),
      repeatInterval: __DEV__
        ? scheduleNotificationIntervals.MINUTE
        : dateIsWithin24Hours
          ? scheduleNotificationIntervals.DAY
          : scheduleNotificationIntervals.WEEK,
    },
  }))
  dispatch(setReminderToUseApp(true))
}

export const removeNotificationToUseApp = () => (dispatch: Dispatch<*>) => {
  dispatch(removeLocalNotification(NOTIFICATION_TO_USE_APP_ID))
}

export const addRemindMeNotification = (moment: Moment) => async (dispatch: Dispatch<*>) => {
  inspector.log('addRemindMeNotification', {
    moment: moment.format('YYYY.DD.MM HH:mm'),
  })

  const notificationTitle = I18n.t('dashboard.pushNotifications.title.Meterie_helps_you_track_your_energy_usage')
  const notificationBody = I18n.t('dashboard.pushNotifications.text.Are_you_ready_to_try_it_out_now_QUESTIONMARK')

  dispatch(addOrUpdateNotificationToUseApp(
    moment,
    notificationTitle,
    notificationBody,
  ))
}

export const addRemindMeNotificationOnFirstTime = (permissionsAllowed: boolean) => async (dispatch: Dispatch<*>) => {
  inspector.log('addRemindMeNotificationOnFirstTime', { permissionsAllowed })

  const scheduledNotificationsIds: string[] = await getScheduledNotificationsIds()

  if (permissionsAllowed && !scheduledNotificationsIds.includes(NOTIFICATION_TO_USE_APP_ID)) {
    const oneDayLater = Moment().add(23, 'h').add(59, 'm')

    dispatch(addRemindMeNotification(oneDayLater))
  }
}

export const addRegularUsageNotification = (moment: Moment) => async (dispatch: Dispatch<*>) => {
  inspector.log('addRegularUsageNotification', {
    moment: moment.format('YYYY.DD.MM HH:mm'),
  })

  const notificationTitle = I18n.t('dashboard.pushNotifications.title.Write_down_your_energy_spending')
  const notificationBody = I18n.t('dashboard.pushNotifications.text.Track_your_energies_with_Meterie_to_see_your_spending_prediction_DOT')

  // dispatch(requestNotificationsPermissions()) TODO: where will called this code ?
  dispatch(addOrUpdateNotificationToUseApp(
    moment,
    notificationTitle,
    notificationBody,
  ))
}
