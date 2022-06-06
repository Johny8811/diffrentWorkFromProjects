/**
 * @Author: Martin Adamko <martin_adamko>
 * @Date:   2017-11-11T14:26:46+01:00
 * @flow
 */

'use strict'; // eslint-disable-line

import { connect } from 'react-redux'
import { type Dispatch } from 'redux-thunk'

import { purchasableFeatures } from '../../../../Config/InAppConfig'
import { type State as ReduxState } from '../../../../Redux/Types'
import { Moment } from '../../../Common/I18n'
import {
  metersActions,
  metersConstants,
  metersSelectors,
} from '../../../Meters/Redux'
import {
  dispatchProps as permissionsDispatchProps,
  statePropsFactory as permissionsStatePropsFactory,
} from '../../../Permissions/Redux'
import { referralSelectors } from '../../../Referral/Redux'
import { unlockSelectors } from '../../../Unlock/Redux'
import {
  appStateActions,
  appStateSelectors,
} from '../../Redux'
import {
  DashboardView,
} from './DashboardView'
import {
  type DispatchProps,
  type OwnProps,
  type Props as PureProps,
  type StateProps,
} from './Types'

const mapStateToProps = (state: ReduxState): StateProps => ({
  ...permissionsStatePropsFactory<ReduxState>(state),
  appOverview: metersSelectors.getOverviewSummary(state),
  availableMeterCounts: referralSelectors.availableMeterCounts(state),
  displayUnit: appStateSelectors.getChartDisplayUnit(state),
  hasInfiniteNumberOfMeters: unlockSelectors.isFeatureEnabled(state, purchasableFeatures.INFINITE_NUMBER_OF_METERS),
  initialCurrency: metersSelectors.getInitialCurrency(state),
  meter: metersSelectors.getMeter(state),
  meterLoading: appStateSelectors.getLoadingStateAccordingSpace(state, metersConstants.LOADING_KEYS.get.meter),
  meters: metersSelectors.getMeters(state),
  metersLoading: appStateSelectors.getLoadingStateAccordingSpace(state, metersConstants.LOADING_KEYS.get.meters),
  purchase: unlockSelectors.getPurchase(state),
  reminderToUseAppAdded: appStateSelectors.getReminderToUseApp(state),
  timeRange: appStateSelectors.getTimeRange(state),
  timeRangeDate: appStateSelectors.getTimeRangeDate(state),
})

// FIXME: Use Dispatch<> instead of *
const mapDispatchToProps = (dispatch: *, ownProps: OwnProps): DispatchProps => ({
  addRemindMeNotification: (moment: Moment) => dispatch(appStateActions.addRemindMeNotification(moment)),
  checkCameraPermissions: (...args: *) => dispatch(permissionsDispatchProps.checkCameraPermissions(...args)),
  checkCameraRollPermissions: (...args: *) => dispatch(permissionsDispatchProps.checkCameraRollPermissions(...args)),
  checkNotificationsPermissions: (...args: *) => dispatch(permissionsDispatchProps.checkNotificationsPermissions(...args)),
  getMeters: () => dispatch(metersActions.getMeters()),
  onMeterPress: (meterId: ?string) => {
    meterId && ownProps.onMeterPress()

    dispatch(metersActions.getMeter(meterId))
  },
  onTimeRangeChange: (...args: *) => dispatch(appStateActions.changeTimeRange(...args)),
  requestCameraPermissions: (...args: *) => dispatch(permissionsDispatchProps.requestCameraPermissions(...args)),
  requestCameraRollPermissions: (...args: *) => dispatch(permissionsDispatchProps.requestCameraRollPermissions(...args)),
  requestNotificationsPermissions: (...args: *) => dispatch(permissionsDispatchProps.requestNotificationsPermissions(...args)),
  setTimeRangeDate: (...args: *) => dispatch(appStateActions.setTimeRangeDate(...args)),
})

export const DashboardConnected = connect<PureProps, OwnProps, StateProps, DispatchProps, _, _>(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardView)
