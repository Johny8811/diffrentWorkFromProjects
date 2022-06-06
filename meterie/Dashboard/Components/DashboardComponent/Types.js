/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-10-29T17:10:43+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import {
  type ReturnValue,
} from '../../../Common/Types'
import { type MeterType } from '../../../Meters/Model/Types'
import {
  metersActions,
  metersSelectors,
} from '../../../Meters/Redux'
import {
  type DispatchProps as PermissionsDispatchProps,
  type StateProps as PermissionsStateProps,
} from '../../../Permissions/Redux'
import { referralSelectors } from '../../../Referral/Redux'
import { unlockSelectors } from '../../../Unlock/Redux'
import {
  appStateActions,
  appStateSelectors,
} from '../../Redux'

export type OwnProps = $Exact<{
  +isOpen: boolean,
  +onAddMeterPress: (meterType?: ?MeterType) => void,
  +onMeterPress: () => void,
  +onOpenSettingsPress: () => void,
  +onScanButtonPress: () => void,
  +onSharePress: () => void,
  +onUpgradePress: () => void,
  +popScreenAbove: () => void,
  +viewportIsSplit: boolean,
}>

export type StateProps = $Exact<{
  ...PermissionsStateProps,
  +appOverview: ReturnValue<typeof metersSelectors.getOverviewSummary>,
  +availableMeterCounts: ReturnValue<typeof referralSelectors.availableMeterCounts>,
  +displayUnit: ReturnValue<typeof appStateSelectors.getChartDisplayUnit>,
  +hasInfiniteNumberOfMeters: boolean,
  +initialCurrency: ReturnValue<typeof metersSelectors.getInitialCurrency>,
  +meter: ReturnValue<typeof metersSelectors.getMeter>,
  +meterLoading: ReturnValue<typeof appStateSelectors.getLoadingStateAccordingSpace>,
  +meters: ReturnValue<typeof metersSelectors.getMeters>,
  +metersLoading: ReturnValue<typeof appStateSelectors.getLoadingStateAccordingSpace>,
  +purchase: ReturnValue<typeof unlockSelectors.getPurchase>,
  +reminderToUseAppAdded: boolean,
  +timeRange: ReturnValue<typeof appStateSelectors.getTimeRange>,
  +timeRangeDate: ReturnValue<typeof appStateSelectors.getTimeRangeDate>,
}>

export type DispatchProps = $Exact<{
  ...PermissionsDispatchProps,
  +addRemindMeNotification: typeof appStateActions.addRemindMeNotification,
  +getMeters: typeof metersActions.getMeters,
  +onMeterPress: (meterId: ?string) => void,
  +onTimeRangeChange: typeof appStateActions.changeTimeRange,
  +setTimeRangeDate: typeof appStateActions.setTimeRangeDate,
}>

export type Props = $Exact<{
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}>
