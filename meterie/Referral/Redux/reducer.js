// @flow
import AsyncStorage from '@react-native-community/async-storage'
import { merge } from 'ramda'
import Env from 'react-native-config'
import { handleActions } from 'redux-actions'
import { persistReducer } from 'redux-persist'

import { Moment } from '../../Common/I18n'
import { type EnumMap } from '../../Common/Types'
import {
  type ActionsTypes,
  type SetAppReferredBy,
  type SetConfirmationMailData,
  type SetFreeMetersCount,
  type SetMail,
  type SetReferralError,
  type SetReferralId,
  type SetReferralMetersCount,
  type SetReferredBy,
  actionsTypes,
} from './actionTypes'

type Action = SetConfirmationMailData |
  SetAppReferredBy |
  SetReferralMetersCount |
  SetReferralId |
  SetMail |
  SetReferredBy |
  SetReferralError |
  SetFreeMetersCount

export type State = {
  appReferredBy: ?string,
  code: ?string,
  email: ?string,
  emailConfirmed: boolean,
  error: ?string,
  expirationTime: ?Moment,
  freeMeters: number,
  referralId: ?string,
  referralsCount: number,
  referredBy: ?string,
}

const initialState: State = {
  appReferredBy: null,
  code: null,
  email: null,
  emailConfirmed: false,
  error: null,
  expirationTime: null,
  freeMeters: Env.COUNT_OF_FREE_METERS,
  referralId: null,
  referralsCount: 0,
  referredBy: null,
}

type ReducerAction = (state: State, payload: Action) => State

const reducers: EnumMap<ActionsTypes, ReducerAction> = {
  [actionsTypes.CLEAR_APP_REFERRED_BY]: (state: State) => merge(state, { appReferredBy: null }),
  [actionsTypes.SET_CONFIRMATION_MAIL_DATA]: (state: State, { payload }: SetConfirmationMailData) => merge(state, payload),
  [actionsTypes.SET_MAIL]: (state: State, { payload }: SetMail) => merge(state, { email: payload }),
  [actionsTypes.CLEAR_EMAIL]: (state: State) => merge(state, { email: null }),
  [actionsTypes.SET_MAIL_CONFIRMED]: (state: State) => merge(state, { emailConfirmed: true }),
  [actionsTypes.SET_REFERRAL_ID]: (state: State, { payload }: SetReferralId) => merge(state, { referralId: payload || null }),
  [actionsTypes.SET_REFERRAL_METERS_COUNT]: (state: State, { payload }: SetReferralMetersCount) => merge(state, {
    referralsCount: payload,
  }),
  [actionsTypes.SET_REFERRED_BY]: (state: State, { payload }: SetReferredBy) => merge(state, { referredBy: payload }),
  [actionsTypes.SET_APP_REFERRED_BY]: (state: State, { payload }: SetAppReferredBy) => merge(state, { appReferredBy: payload }),
  [actionsTypes.SET_REFERRAL_ERROR]: (state: State, { payload }: SetReferralError) => merge(state, { error: payload }),
  [actionsTypes.SET_FREE_METERS_COUNT]: (state: State, { payload }: SetFreeMetersCount) => merge(state, { freeMeters: payload }),
}

const persistConfig = {
  key: 'referral',
  storage: AsyncStorage,
  whitelist: [
    'referralsCount',
  ],
}

const reducer = handleActions<State, Action>(reducers, initialState)
const persistedReducer = persistReducer<State, Action>(persistConfig, reducer)

export default persistedReducer
