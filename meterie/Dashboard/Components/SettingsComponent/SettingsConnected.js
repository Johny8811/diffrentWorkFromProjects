/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-09-30T17:09:43+02:00
 * @Copyright: Martin Adamko
 * @flow
**/

import { connect } from 'react-redux'

import { purchasableFeatures } from '../../../../Config/InAppConfig'
import { type State as ReduxState } from '../../../../Redux/Types'
import {
  metersConstants,
  metersSelectors,
} from '../../../Meters/Redux'
import {
  dispatchProps as permissionsDispatchProps,
  statePropsFactory as permissionsStatePropsFactory,
} from '../../../Permissions/Redux'
import { referralSelectors } from '../../../Referral/Redux'
import { unlockSelectors } from '../../../Unlock/Redux'
import { appStateSelectors } from '../../Redux'
import { SettingsView } from './SettingsView'
import {
  type DispatchProps,
  type OwnProps,
  type Props,
  type StateProps,
} from './Types'

export const SettingsConnected = connect<Props, OwnProps, StateProps, DispatchProps, _, _>((state: ReduxState): StateProps => ({
  ...permissionsStatePropsFactory<ReduxState>(state),
  appReferredBy: referralSelectors.getAppReferredBy(state),
  freshlyInstalled: !metersSelectors.getMetersCount(state),
  hasInfiniteNumberOfMeters: unlockSelectors.isFeatureEnabled(state, purchasableFeatures.INFINITE_NUMBER_OF_METERS),
  initialCurrency: metersSelectors.getInitialCurrency(state),
  metersLoading: appStateSelectors.getLoadingStateAccordingSpace(state, metersConstants.LOADING_KEYS.get.meters),
  referralId: referralSelectors.getReferralId(state),
  referredBy: referralSelectors.getReferredBy(state),
  reminderToUseAppAdded: appStateSelectors.getReminderToUseApp(state),
  updateMeterCurrenciesLoading: appStateSelectors.getLoadingStateAccordingSpace(state, metersConstants.LOADING_KEYS.update.currency),
}), {
  ...permissionsDispatchProps,
})(SettingsView)
