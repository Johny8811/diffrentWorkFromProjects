// @flow

import {
  type IsoDateString,
  type TimeRange,
} from '../../Common/Types'

const PREFIX = 'appState'

const CHANGE_TIME_RANGE = `${PREFIX} CHANGE_TIME_RANGE`

const INITIAL_TIME_RANGE = `${PREFIX} INITIAL_TIME_RANGE`

const SET_LOADING_STATE = `${PREFIX} SET_LOADING_STATE`

const SET_REMINDER_TO_USE_APP = `${PREFIX} SET_REMINDER_TO_USE_APP`

const SET_TIME_RANGE_DATE = `${PREFIX} SET_TIME_RANGE_DATE`

const SWITCH_CHART_DISPLAY_UNIT = `${PREFIX} SWITCH_CHART_DISPLAY_UNIT`

const SET_LOCALE = `${PREFIX} SET_LOCALE`

export type ChangeTimeRange = { payload: TimeRange, type: typeof CHANGE_TIME_RANGE }

export type InitialTimeRange = { payload: TimeRange, type: typeof INITIAL_TIME_RANGE }

export type SetLoadingState = { payload: { loadingState: boolean, space: string }, type: typeof SET_LOADING_STATE }

export type SetReminderToUseApp = { payload: boolean, type: typeof SET_REMINDER_TO_USE_APP }

export type SetTimeRangeDate = { payload: ?IsoDateString, type: typeof SET_TIME_RANGE_DATE }

export type SetLocale = { payload: ?string, type: typeof SET_LOCALE }

export const actionTypes = {
  CHANGE_TIME_RANGE,
  INITIAL_TIME_RANGE,
  SET_LOADING_STATE,
  SET_LOCALE,
  SET_REMINDER_TO_USE_APP,
  SET_TIME_RANGE_DATE,
  SWITCH_CHART_DISPLAY_UNIT,
}

export type ActionsTypes = $Values<typeof actionTypes>
