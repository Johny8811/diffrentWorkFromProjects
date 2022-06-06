// @flow

import { createAction } from 'redux-actions'

import {
  type IsoDateString,
  type TimeRange,
} from '../../../Common/Types'
import { actionTypes } from '../actionTypes'

export const setLoadingState = createAction<typeof actionTypes.SET_LOADING_STATE, *, *>(
  actionTypes.SET_LOADING_STATE,
  (space: string, loadingState: boolean) => ({ space, loadingState })
)

export const changeTimeRange = createAction<typeof actionTypes.CHANGE_TIME_RANGE, TimeRange>(actionTypes.CHANGE_TIME_RANGE)

export const setTimeRangeDate = createAction<typeof actionTypes.SET_TIME_RANGE_DATE, ?IsoDateString>(actionTypes.SET_TIME_RANGE_DATE)

export const switchChartDisplayUnit = createAction<typeof actionTypes.SWITCH_CHART_DISPLAY_UNIT, void>(actionTypes.SWITCH_CHART_DISPLAY_UNIT)

export const setLocale = createAction<typeof actionTypes.SET_LOCALE, ?string>(actionTypes.SET_LOCALE)
