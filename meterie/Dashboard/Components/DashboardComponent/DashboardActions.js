/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-02-23T18:02:07+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'

import { Button, Content, Spacer, Text } from '../../../Common/Components'
import { Loading } from '../../../Common/Components/Layout'
import { I18n } from '../../../Common/I18n'
import { Log } from '../../../Common/Log'
import { themeNames } from '../../../Common/Theme'
import { useSelectMeterTypeModal } from '../../../Meters/Components/SelectMeterType'
import { getTotalAvailableCount } from '../../../Meters/Model/Helpers'
import {
  type AvailableMeterCounts,
  type MeterType,
} from '../../../Meters/Model/Types'
import { DashboardOnboardingActions } from './DashboardOnboardingActions'
import { type OtherMeterType } from './MeterTypeButtons'

const PRIMARY_ACTION_KEY = 'primary-action-key'
const SECONDARY_ACTION_KEY = 'secondary-action-key'

type Props = $Exact<{
  +availableMeterCounts: AvailableMeterCounts,
  +disabled: boolean,
  +hasInfiniteNumberOfMeters: boolean,
  +loading: boolean,
  +metersCount: number,
  +onAddMeterPress: (meterType?: ?MeterType) => void,
  +onSharePress: () => void,
  +onUpgradePress: () => void,
  +reminderToUseAppAdded: boolean,
}>

const inspector = new Log('Dashboard.Components.DashboardComponent.DashboardActions')

export const DashboardActions = React.memo<Props>(({
  availableMeterCounts,
  disabled,
  hasInfiniteNumberOfMeters,
  loading,
  metersCount,
  onAddMeterPress,
  onSharePress,
  onUpgradePress,
  reminderToUseAppAdded,
}: Props) => {
  const [, showSelectMeterType] = useSelectMeterTypeModal()

  const meterTypeSelected = React.useRef<void | MeterType | OtherMeterType>(undefined)

  const onMeterTypeSelected = React.useCallback(() => {
    inspector.log('onMeterTypeSelected', meterTypeSelected)

    if (typeof meterTypeSelected.current !== 'undefined') {
      onAddMeterPress(meterTypeSelected.current)
    }

    meterTypeSelected.current = undefined
  }, [onAddMeterPress])

  const pickMeterType = React.useCallback(() => {
    inspector.log('pickMeterType')

    showSelectMeterType(
      onMeterTypeSelected,
      {
        loading,
        onSelect: (meterType: MeterType | OtherMeterType) => {
          meterTypeSelected.current = meterType
        },
      }
    )
  }, [loading, onMeterTypeSelected, showSelectMeterType])

  const totalAvailableCount = getTotalAvailableCount(availableMeterCounts)
  const metersLeft = hasInfiniteNumberOfMeters ? undefined : Math.max(0, totalAvailableCount - metersCount)
  const metersExceeded = hasInfiniteNumberOfMeters ? false : totalAvailableCount <= metersCount

  return metersCount > 0
    ? <Content>
      <Button
        key={PRIMARY_ACTION_KEY}
        opaque
        alignSelf='center'
        disabled={disabled}
        theme={[themeNames.SUCCESS_LIGHT, themeNames.SUCCESS_DARK]}
        title={I18n.t('dashboard.dashboard.action.ADD_UTILITY_METER')}
        onPress={metersExceeded
          ? onUpgradePress
          : pickMeterType}
      />
      {typeof metersLeft === 'number'
        ? <Text caption align='center' theme={[themeNames.LIGHT, themeNames.DARK]}>
          {metersLeft === 0
            ? I18n.t('dashboard.dashboard.label.NO_METERS_LEFT')
            : I18n.tf('dashboard.dashboard.label.N_METERS_LEFT', [metersLeft.toString()])}
        </Text>
        : null}
      <Button
        key={SECONDARY_ACTION_KEY}
        opaque
        alignSelf='center'
        disabled={disabled}
        theme={[themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]}
        title={I18n.t('general.actions.action.SHARE_APP_WITH_FRIENDS')}
        onPress={onSharePress}
      />
    </Content>
    : loading
      ? <Loading.View
        isActive={loading}
      />
      : <>
        <Spacer flexGrow={1} vertical={3} />
        <DashboardOnboardingActions
          disabled={disabled}
          loading={loading}
          showRemindMe={!reminderToUseAppAdded}
          onAddMeterPress={onAddMeterPress}
        />
      </>
})

DashboardActions.displayName = 'DashboardActions'
