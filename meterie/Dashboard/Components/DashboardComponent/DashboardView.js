/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-02T11:01:43+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'
import { RefreshControl } from 'react-native'
import { useDarkMode } from 'react-native-dark-mode'
import withNavigationFocus from 'react-navigation/src/views/withNavigationFocus'

import {
  ActionContainer,
  Content,
  OrientationView,
  ScanButton,
  Spacer,
  Strong,
  SvgImage,
  Title,
  View,
} from '../../../Common/Components'
import { SCAN_BUTTON_SIZE } from '../../../Common/Components/Button/ScanButton'
import { GradientContainer } from '../../../Common/Components/Layout'
import {
  type DimensionsState,
  withOrientation,
} from '../../../Common/Components/Layout/withOrientation'
import {
  I18n,
  Moment,
} from '../../../Common/I18n'
import { Log } from '../../../Common/Log/LogDevelopment'
import { themeNames } from '../../../Common/Theme'
import {
  PRIMARY_COLOR_ON_DARK,
  PRIMARY_COLOR_ON_LIGHT,
} from '../../../Common/Theme/Colors'
import { timeRanges } from '../../../Common/Types'
import { BarGraph } from '../../../Measurements/Components/ConsumptionGraph/BarGraph'
import {
  type Distribution,
  DistributionGraph,
} from '../../../Measurements/Components/DistributionGraph'
import { type Price } from '../../../Measurements/Model/TypesCommon'
import { type MeterOverview } from '../../../Measurements/Overview/Types'
import { useTimeRange } from '../../../Measurements/Overview/useTimeRange'
import { MetersList } from '../../../Meters/Components/MetersList'
import { TimeRangeSwitcher } from '../../../Meters/Components/TimeRangeSwitcher'
import {
  countMeters,
  getThemeNameByType,
  getTotalAvailableCount,
} from '../../../Meters/Model/Helpers'
import { type MeterDocument } from '../../../Meters/Model/TypesNext'
import { Frame } from '../../../Onboarding/Components/IntroComponent/Illustrations/Animated'
import { Graph } from '../../../Onboarding/Components/IntroComponent/Illustrations/Graph'
import { RNView } from '../../../ReactNative/RNView'
import { useNumberOfMetersExceeded } from '../../../Unlock/Components/NumberOfMetersExceeded'
import { purchaseStatuses } from '../../../Unlock/Model/Types'
import { ArrayUtils, ObjectUtils } from '../../../Utils'
import { displayUnits } from '../../Model/Types'
import { ForecastSummary } from '../ForecastSummary/ForecastSummary'
import { DashboardActions } from './DashboardActions'
import { HowItWorks } from './HowItWorks'
import { type Props as PureProps } from './Types'

const defaultBottomInset = {
  bottom: 'always',
  top: 'never',
}

function noop () { /* EMPTY CALL */ }

type HocProps = $Exact<{
  isFocused: boolean | void,
}>

type Props = $Exact<{
  ...HocProps,
  ...DimensionsState,
  ...PureProps,
}>

const inspector = new Log('Dashboard.Components.DashboardComponent.DashboardView')

const DashboardViewComponent = ({
  addRemindMeNotification,
  appOverview,
  availableMeterCounts,
  displayUnit,
  getMeters,
  gettingNotificationsPermissions,
  hasInfiniteNumberOfMeters,
  initialCurrency,
  isFocused,
  isLandscape,
  isLargeDevice,
  isOpen,
  meter,
  meterLoading,
  meters,
  metersLoading,
  notificationsAllowed,
  onAddMeterPress,
  onMeterPress,
  onOpenSettingsPress,
  onScanButtonPress,
  onSharePress,
  onTimeRangeChange,
  onUpgradePress,
  popScreenAbove,
  purchase,
  reminderToUseAppAdded,
  requestNotificationsPermissions,
  setTimeRangeDate,
  timeRange,
  timeRangeDate,
  viewportIsSplit,
  ...rest
}: Props) => {
  const renders = React.useRef(0)

  renders.current += 1

  const meterIsSelectedOnDashboard = React.useRef<boolean>(false)
  const meterIsSelectedInSplitView = React.useRef<boolean>(false)

  const onMeterSelect = React.useCallback((meterId?: string) => {
    onMeterPress(meterId)
    meterIsSelectedOnDashboard.current = !!meterId
    meterIsSelectedInSplitView.current = !!meterId && viewportIsSplit
  }, [onMeterPress, viewportIsSplit])

  // TODO: When the old Meter is removed the `onMeterPressTemporary`
  // could be directly replaced with onMeterSelect.
  const onMeterPressTemporary = React.useCallback((meter: MeterDocument) => {
    onMeterSelect(meter._id)
  }, [onMeterSelect])

  React.useEffect(() => {
    if (meter && isFocused && !meterLoading) {
      // Mobile
      if (!viewportIsSplit) {
        if (meterIsSelectedInSplitView.current) {
          onMeterSelect(meter._id) // Navigates >>> meter
        } else {
          onMeterSelect() // Deselect
        }
      }
    }

    if (meter && !isFocused) {
      // Tablet
      if (viewportIsSplit) {
        if (meterIsSelectedOnDashboard.current && !meterIsSelectedInSplitView.current) {
          popScreenAbove()
          meterIsSelectedOnDashboard.current = true
          meterIsSelectedInSplitView.current = true
        }
      }
    }
  }, [isFocused, meter, meterLoading, onMeterSelect, popScreenAbove, viewportIsSplit])

  const [, showNumberOfMetersExceeded] = useNumberOfMetersExceeded()
  const isDarkMode: boolean = useDarkMode()

  const onDisabledPress = React.useCallback((meter: MeterDocument | string) => {
    showNumberOfMetersExceeded(
      noop,
      {
      // TODO: When the old Meter type is removed the `meters[meter._id]`
      // could be directly replaced with `meter` again.
        onMeterPress: () => {
          if (meters) {
            onMeterPress(typeof meter === 'string' ? meter : meter._id)
          }
        },
        onSharePress,
        onUpgradePress,
      }
    )
  }, [meters, onMeterPress, onSharePress, onUpgradePress, showNumberOfMetersExceeded])

  const {
    currentTimeRangeDate,
    date: [, month, year],
    // dayOfWeek, // TODO: Remove if never used
    groupBy,
    groupByOffset,
    nextTimeRangeDate,
    previousTimeRangeDate,
    // today: [todayDay, todayMonth, todayYear], // TODO: Remove if never used
    todayIndex,
  } = useTimeRange({
    date: timeRangeDate,
    timeRange,
  })

  const onSwipeForwards = React.useCallback(() => {
    setTimeRangeDate(nextTimeRangeDate)
  }, [nextTimeRangeDate, setTimeRangeDate])
  const onSwipeBackwards = React.useCallback(() => {
    setTimeRangeDate(previousTimeRangeDate)
  }, [previousTimeRangeDate, setTimeRangeDate])

  const onSelectMonth = React.useCallback((index: number) => {
    const moment = Moment([year, index, 1])

    if (moment.isValid()) {
      setTimeRangeDate(moment.toISOString())
      onTimeRangeChange(timeRanges.MONTH)
    }
  }, [onTimeRangeChange, setTimeRangeDate, year])

  const consumption = appOverview
    ? appOverview.consumption
    : undefined

  const currentYearKey = year.toString()
  const previousYearKey = (year - 1).toString()

  const previousMonth = month === 0 ? 11 : month - 1
  const previousMonthYearKey = month === 0 ? previousYearKey : currentYearKey

  const currentYearOverview = consumption && consumption[currentYearKey]
    ? consumption && consumption[currentYearKey]
    : undefined
  const previousYearOverview = consumption && consumption[previousYearKey]
    ? consumption && consumption[previousYearKey]
    : undefined

  const currentMonthOverview = currentYearOverview && currentYearOverview.months[month]
    ? currentYearOverview.months[month]
    : undefined
  const previousMonthOverview = consumption && consumption[previousMonthYearKey] && consumption[previousMonthYearKey].months[previousMonth]
    ? consumption[previousMonthYearKey].months[previousMonth]
    : undefined

  const lastValueOfCurrentYear = currentYearOverview
    ? [currentYearOverview.consumption, currentYearOverview.price, currentYearOverview.nativity]
    : undefined
  const lastValueOfPreviousYear = previousYearOverview
    ? [previousYearOverview.consumption, previousYearOverview.price, previousYearOverview.nativity]
    : undefined

  const lastValueOfCurrentMonth = currentMonthOverview
    ? [currentMonthOverview.consumption, currentMonthOverview.price, currentMonthOverview.nativity]
    : undefined
  const lastValueOfPreviousMonth = previousMonthOverview
    ? [previousMonthOverview.consumption, previousMonthOverview.price, previousMonthOverview.nativity]
    : undefined

  const isLastValueOfCurrentPeriodNative = timeRange === timeRanges.MONTH
    ? !!(currentMonthOverview && currentMonthOverview.values && ArrayUtils.lastValue(currentMonthOverview.values)[2])
    : !!(currentYearOverview && currentYearOverview.values && ArrayUtils.lastValue(currentYearOverview.values)[2])

  const mapToYearDistributionSegments = React.useMemo(() => ({
    consumption: yearsConsumptionMap,
    meter: {
      _id: id,
      name,
      type,
    },
  }: MeterOverview) => {
    const price: Price = yearsConsumptionMap[currentYearKey]?.price || 0

    return {
      id,
      label: name,
      theme: getThemeNameByType(type)[isDarkMode ? 1 : 0],
      value: price,
    }
  }, [currentYearKey, isDarkMode])

  const mapToMonthDistributionSegments = React.useMemo(() => ({
    consumption: yearsConsumptionMap,
    meter: {
      _id: id,
      name,
      type,
    },
  }: MeterOverview) => {
    const price: Price = yearsConsumptionMap[currentYearKey]?.months[month].price || 0

    return {
      id,
      label: name,
      theme: getThemeNameByType(type)[isDarkMode ? 1 : 0],
      value: price,
    }
  }, [currentYearKey, isDarkMode, month])

  const monthUsageDistribution: Distribution = appOverview && appOverview.meters && lastValueOfCurrentMonth
    ? {
      segments: ObjectUtils.objectValues(appOverview.meters).map(mapToMonthDistributionSegments),
      sum: lastValueOfCurrentMonth[1],
    }
    : { segments: [], sum: 0 }
  const yearUsageDistribution: Distribution = appOverview && appOverview.meters && lastValueOfCurrentYear
    ? {
      segments: ObjectUtils.objectValues(appOverview.meters).map(mapToYearDistributionSegments),
      sum: lastValueOfCurrentYear[1],
    }
    : { segments: [], sum: 0 }

  const metersCount = React.useMemo(() => countMeters(meters), [meters])
  const totalAvailableCount = getTotalAvailableCount(availableMeterCounts)
  const metersExceeded = hasInfiniteNumberOfMeters ? false : totalAvailableCount <= metersCount

  const disabled = metersLoading || !isFocused

  const settingsButtonProps = React.useMemo(() => ({
    children: <SvgImage name='CogInactive' />,
    onPress: onOpenSettingsPress,
    title: isLargeDevice
      ? I18n.t('dashboard.dashboard.action.SETTINGS')
      : null,
  }), [isLargeDevice, onOpenSettingsPress])

  const unlockButtonProps = React.useMemo(() => ({
    children: <SvgImage
      name='ShoppingBag'
      props={{
        status: purchase && purchase.status
          ? purchase.status
          : hasInfiniteNumberOfMeters
            ? purchaseStatuses.SUCCESS
            : undefined,
      }}
    />,
    disabled,
    onPress: metersCount === 0 ? null : onUpgradePress,
    title: isLargeDevice
      ? I18n.t('dashboard.dashboard.action.UNLOCK')
      : null,
  }), [disabled, hasInfiniteNumberOfMeters, isLargeDevice, onUpgradePress, purchase])

  const handleOnRefresh = React.useCallback(() => { getMeters() }, [getMeters])

  const navBarProps = React.useMemo(() => ({
    leftButton: unlockButtonProps,
    rightButton: settingsButtonProps,
    showLogo: true,
    touchesTop: false,
  }), [settingsButtonProps, unlockButtonProps])

  inspector.log(`RENDER#${renders.current}`)

  return <>
    <ActionContainer
      // backgroundGradientTheme={[themeNames.LIGHT, themeNames.DARK]}
      id='dashboard-next'
      navBarProps={navBarProps}
      refreshControl={<RefreshControl
        refreshing={!!metersLoading}
        onRefresh={handleOnRefresh}
      />}
      theme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}
    >
      <GradientContainer>
        {metersCount === 0
          ? <Content>
            <OrientationView
              landscapeProps={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
              position='relative'
            >
              <Frame>
                <Graph active color={isDarkMode ? PRIMARY_COLOR_ON_DARK : PRIMARY_COLOR_ON_LIGHT} />
              </Frame>
              <Spacer vertical={4} />
              <Title flexShrink={1}>{I18n.t('dashboard.dashboard.title.SAVE_ENERGIES_COMMA_FINANCES_COMMA_NATURE_AND_GET_USAGE_OVERVIEW_WITH_FORECAST_DOT')}</Title>
            </OrientationView>
            {!meters && !metersLoading && <>
              <Spacer vertical={4} />
              <OrientationView landscapeProps={{ alignSelf: 'center' }} paddingHorizontal={1}>
                <HowItWorks theme={[themeNames.LIGHT, themeNames.DARK]} />
              </OrientationView>
            </>}
          </Content>
          : <>
            <Content paddingVertical={0}>
              <Strong align='center'>
                {isLastValueOfCurrentPeriodNative
                  ? I18n.t('general.forecastOverview.heading.USAGE_OVERVIEW')
                  : I18n.t('general.forecastOverview.heading.USAGE_FORECAST')}
              </Strong>
            </Content>
            <Content>
              {initialCurrency && <ForecastSummary
                currency={initialCurrency}
                currentValue={timeRange === timeRanges.MONTH
                  ? lastValueOfCurrentMonth
                  : lastValueOfCurrentYear}
                previousTimeRangeDate={previousTimeRangeDate}
                previousValue={timeRange === timeRanges.MONTH
                  ? lastValueOfPreviousMonth
                  : lastValueOfPreviousYear}
                timeRange={timeRange}
                timeRangeDate={currentTimeRangeDate}
              />}
            </Content>

            <BarGraph
              horizontalLabels
              verticalLabels
              dataSets={timeRange === timeRanges.MONTH
                ? (currentMonthOverview && currentMonthOverview.values) || []
                : (currentYearOverview && currentYearOverview.values) || []}
              displayUnit={displayUnits.PRICE}
              groupBy={groupBy}
              groupByOffset={groupByOffset}
              height={viewportIsSplit ? undefined : 100}
              horizontalLabelsTheme={[themeNames.LIGHT, themeNames.DARK]}
              paddingLeft={4}
              paddingTop={0}
              todayIndex={todayIndex}
              onSelect={timeRange === timeRanges.MONTH ? undefined : onSelectMonth}
              onSwipeBackwards={onSwipeBackwards}
              onSwipeForwards={onSwipeForwards}
            />
            <Content alignItems='center' paddingVertical={2} theme={[themeNames.LIGHT, themeNames.DARK]}>
              <TimeRangeSwitcher
                theme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}
                timeRange={timeRange}
                timeRangeDate={currentTimeRangeDate}
                onTimeRangeChange={onTimeRangeChange}
              />
            </Content>
          </>}
      </GradientContainer>

      {appOverview && <Content>
        <Strong align='center'>{I18n.t('dashboard.dashboard.heading.USAGE_DISTRIBUTION')}</Strong>
        <Spacer vertical={2} />
        <DistributionGraph
          distribution={timeRange === timeRanges.MONTH
            ? monthUsageDistribution
            : yearUsageDistribution}
          theme={[themeNames.LIGHT, themeNames.DARK]}
          onSelect={metersExceeded ? onDisabledPress : onMeterSelect}
        />
        <Spacer vertical={4} />
        <MetersList
          showIcon
          disabled={disabled}
          groupBy={groupBy}
          groupByOffset={groupByOffset}
          initialCurrency={initialCurrency}
          isLoading={!!metersLoading}
          limit={totalAvailableCount}
          meterOverviews={appOverview.meters}
          month={month}
          timeRange={timeRange}
          todayIndex={todayIndex}
          verticalSpacing={2}
          year={year}
          onDisabledPress={metersExceeded ? onDisabledPress : undefined}
          onMeterPress={onMeterPressTemporary}
        />
      </Content>}
      <Spacer vertical={4} />
      {!viewportIsSplit && <DashboardActions
        availableMeterCounts={availableMeterCounts}
        disabled={disabled}
        hasInfiniteNumberOfMeters={hasInfiniteNumberOfMeters}
        loading={!!metersLoading}
        metersCount={metersCount}
        reminderToUseAppAdded={reminderToUseAppAdded}
        onAddMeterPress={onAddMeterPress}
        onSharePress={onSharePress}
        onUpgradePress={onUpgradePress}
      />}
      <RNView height={meters ? SCAN_BUTTON_SIZE + 44 : undefined} />
      <View useSafeArea forceInset={defaultBottomInset} />
    </ActionContainer>
    {meters && !(viewportIsSplit && meter) && <ScanButton
      disabled={!!metersLoading || !isFocused}
      theme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}
      onPress={onScanButtonPress}
    />}
  </>
}

export const DashboardView = withNavigationFocus(withOrientation((DashboardViewComponent)))
