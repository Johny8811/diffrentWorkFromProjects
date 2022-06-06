// @flow
import AsyncStorage from '@react-native-community/async-storage'
import { merge } from 'ramda'
import { handleActions } from 'redux-actions'
import { persistReducer } from 'redux-persist'

import { Moment } from '../../Common/I18n'
import {
  type EnumMap,
  type IsoDateString,
  type TimeRange,
  timeRanges,
} from '../../Common/Types'
import {
  type DisplayUnit,
  displayUnits,
} from '../Model/Types'
import {
  type ActionsTypes,
  type ChangeTimeRange,
  type InitialTimeRange,
  type SetLoadingState,
  type SetLocale,
  type SetReminderToUseApp,
  type SetTimeRangeDate,
  actionTypes,
} from './actionTypes'

type Action =
  InitialTimeRange |
  ChangeTimeRange |
  SetLoadingState |
  SetLocale |
  SetReminderToUseApp |
  SetTimeRangeDate

export type LoadingType = { [string]: boolean }

export type State = {
  +displayUnit: DisplayUnit,
  +internetConnection: ?string,
  +loading: ?LoadingType,
  +locale: ?string,
  +reminderToUseApp: boolean,
  +timeRange: TimeRange,
  +timeRangeDate: ?IsoDateString,
}

const initialState: State = {
  displayUnit: displayUnits.PRICE,
  internetConnection: null,
  loading: null,
  locale: null,
  reminderToUseApp: false,
  timeRange: timeRanges.MONTH,
  timeRangeDate: null,
}

type ReducerAction = (state: State, payload: Action) => State

const reducers: EnumMap<ActionsTypes, ReducerAction> = {
  [actionTypes.CHANGE_TIME_RANGE]: (state: State, { payload }: ChangeTimeRange) => merge(state, { timeRange: payload }),
  [actionTypes.SET_LOADING_STATE]: (state: State, { payload }: SetLoadingState) => {
    const { loadingState, space } = payload

    return merge(state, {
      loading: merge(state.loading, {
        [space]: loadingState,
      }),
    })
  },
  [actionTypes.SET_LOCALE]: (state: State, { payload }: SetLocale) => merge(state, { locale: payload }),
  [actionTypes.SET_REMINDER_TO_USE_APP]: (state: State, { payload }: SetReminderToUseApp) => merge(state, { reminderToUseApp: payload }),
  [actionTypes.SET_TIME_RANGE_DATE]: (state: State, { payload }: SetTimeRangeDate) => {
    const endOfMonth = Moment().endOf('month').toISOString()
    const timeRangeDate = payload
      ? payload <= endOfMonth
        ? payload
        : endOfMonth
      : null

    return merge(state, { timeRangeDate })
  },
  [actionTypes.SWITCH_CHART_DISPLAY_UNIT]: (state: State) => merge(state, {
    displayUnit: state.displayUnit === displayUnits.PRICE
      ? displayUnits.PHYSICAL
      : displayUnits.PRICE,
  }),
}

const persistConfig = {
  key: 'appState',
  storage: AsyncStorage,
  whitelist: [
    'locale',
    'reminderToUseApp',
    'timeRange',
  ],
}

const reducer = handleActions<State, Action>(reducers, initialState)
const persistedReducer = persistReducer<State, Action>(persistConfig, reducer)

export default persistedReducer
