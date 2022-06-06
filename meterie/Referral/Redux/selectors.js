// @flow

import { createSelector } from 'reselect'

import { purchasableFeatures } from '../../../Config/InAppConfig'
import { type State as ReduxState } from '../../../Redux/Types'
import { type AvailableMeterCounts } from '../../Meters/Model/Types'
import { unlockSelectors } from '../../Unlock/Redux'
import { type ConfirmationMailData } from '../Model/Types'
import { sumCountsMap } from './helpers'

export const getEmail = (state: ReduxState) => state.referral.email

export const availableMetersCount = (state: ReduxState) => sumCountsMap(availableMeterCounts(state))

// TODO: Should not be hardcoded. There must be a method to deside whethet user
// is eligible to create any more meters
export const getReferredByCount = (state: ReduxState) => state.referral.referredBy ? 1 : 0

export const getReferralMetersCount = (state: ReduxState) => state.referral.referralsCount

export const getEmailConfirmation = (state: ReduxState) => state.referral.emailConfirmed

export const getReferralId = (state: ReduxState) => state.referral.referralId

export const getReferredBy = (state: ReduxState) => state.referral.referredBy

export const getCode = (state: ReduxState) => state.referral.code

export const getExpirationTime = (state: ReduxState) => state.referral.expirationTime

export const getAppReferredBy = (state: ReduxState) => state.referral.appReferredBy

export const getReferralError = (state: ReduxState) => state.referral.error

export const getFreeMetersCount = (state: ReduxState) => state.referral.freeMeters

export const availableMeterCounts = createSelector<ReduxState, void, AvailableMeterCounts, number, number, number, number>(
  (state: ReduxState) => unlockSelectors.isFeatureEnabled(state, purchasableFeatures.INFINITE_NUMBER_OF_METERS) ? Infinity : 0,
  getFreeMetersCount,
  getReferredByCount,
  getReferralMetersCount,
  (bought: number, freeMetersCount: number, viaInstall: number, viaReferal: number) => ({
    bought,
    free: freeMetersCount,
    viaInstall,
    viaReferal,
  })
)

export const getConfirmationMailData = createSelector<ReduxState, void, ConfirmationMailData, $PropertyType<ConfirmationMailData, 'code'>, $PropertyType<ConfirmationMailData, 'expirationTime'>>(
  getCode,
  getExpirationTime,
  (
    code: $PropertyType<ConfirmationMailData, 'code'>,
    expirationTime: $PropertyType<ConfirmationMailData, 'expirationTime'>,
  ) => ({
    code,
    expirationTime,
  })
)
