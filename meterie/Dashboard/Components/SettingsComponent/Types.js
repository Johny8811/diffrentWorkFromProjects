/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-09-30T17:09:14+02:00
 * @Copyright: Martin Adamko
 * @flow
**/

import { type ReturnValue } from '../../../Common/Types'
import {
  metersSelectors,
} from '../../../Meters/Redux'
import {
  type DispatchProps as PermissionsDispatchProps,
  type StateProps as PermissionsStateProps,
} from '../../../Permissions/Redux'
import { referralSelectors } from '../../../Referral/Redux'
import { appStateSelectors } from '../../Redux'

export type OwnProps = $Exact<{
  +onSharePress: () => void,
  +onUpgradePress: () => void,
  +visible?: boolean,
}>

export type StateProps = $Exact<{
  ...PermissionsStateProps,
  +appReferredBy: ReturnValue<typeof referralSelectors.getAppReferredBy>,
  +freshlyInstalled: boolean,
  +hasInfiniteNumberOfMeters: boolean,
  +initialCurrency: ReturnValue<typeof metersSelectors.getInitialCurrency>,
  +metersLoading: ReturnValue<typeof appStateSelectors.getLoadingStateAccordingSpace>,
  +referralId: ReturnValue<typeof referralSelectors.getReferralId>,
  +referredBy: ReturnValue<typeof referralSelectors.getReferredBy>,
  +reminderToUseAppAdded: ReturnValue<typeof appStateSelectors.getReminderToUseApp>,
  +updateMeterCurrenciesLoading: ReturnValue<typeof appStateSelectors.getLoadingStateAccordingSpace>,
}>

export type DispatchProps = $Exact<{
  ...PermissionsDispatchProps,
}>

export type Props = $Exact<{
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}>
