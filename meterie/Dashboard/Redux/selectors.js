// @flow

import { type State as ReduxState } from '../../../Redux/Types'
import { timeRanges } from '../../Common/Types'
import { type DisplayUnit } from '../Model/Types'

export const getTimeRange = (state: ReduxState) => state.appState && state.appState.timeRange ? state.appState.timeRange : timeRanges.MONTH

export const getLoadingStateAccordingSpace = (state: ReduxState, space: string): ?boolean => state.appState && state.appState.loading && state.appState.loading[space]

export const getReminderToUseApp = (state: ReduxState): boolean => state.appState && state.appState.reminderToUseApp

export const getTimeRangeDate = (state: ReduxState) => state.appState && state.appState.timeRangeDate
  ? state.appState.timeRangeDate
  : null

export const getChartDisplayUnit = (state: ReduxState): DisplayUnit => state.appState && state.appState.displayUnit

export const getLocale = (state: ReduxState): ?string => state.appState?.locale
