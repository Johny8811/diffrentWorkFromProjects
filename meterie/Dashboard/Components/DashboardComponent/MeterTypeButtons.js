/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-08T13:01:25+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'

import { Button } from '../../../Common/Components'
import { I18n } from '../../../Common/I18n'
import { themeNames } from '../../../Common/Theme'
import {
  type MeterType,
  meterTypes,
} from '../../../Meters/Model/Types'

export const OTHER_METER_TYPE = null

export type OtherMeterType = typeof OTHER_METER_TYPE

type Props = $Exact<{
  disabled?: boolean,
  loading?: boolean,
  onMeterPress: (meterType: MeterType | OtherMeterType) => void,
}>

export const MeterTypeButtons = ({
  disabled,
  loading,
  onMeterPress,
}: Props) => {
  const onElectricityPress = React.useCallback(() => { onMeterPress(meterTypes.ELECTRICITY) }, [onMeterPress])
  const onGasPress = React.useCallback(() => { onMeterPress(meterTypes.GAS) }, [onMeterPress])
  const onWaterPress = React.useCallback(() => { onMeterPress(meterTypes.WATER) }, [onMeterPress])
  const onHotWaterPress = React.useCallback(() => { onMeterPress(meterTypes.HOT_WATER) }, [onMeterPress])
  const onOtherPress = React.useCallback(() => { onMeterPress(OTHER_METER_TYPE) }, [onMeterPress])

  return <>
    <Button
      disabled={!!disabled}
      loading={!!loading}
      theme={[themeNames.PRIMARY_LIGHT, themeNames.PRIMARY_DARK]}
      title={I18n.t('dashboard.meterTypeButtons.action.ELECTRICITY')}
      onPress={onElectricityPress}
    />
    <Button
      disabled={!!disabled}
      loading={!!loading}
      theme={[themeNames.PRIMARY_LIGHT, themeNames.PRIMARY_DARK]}
      title={I18n.t('dashboard.meterTypeButtons.action.GAS')}
      onPress={onGasPress}
    />
    <Button
      disabled={!!disabled}
      loading={!!loading}
      theme={[themeNames.PRIMARY_LIGHT, themeNames.PRIMARY_DARK]}
      title={I18n.t('dashboard.meterTypeButtons.action.WATER')}
      onPress={onWaterPress}
    />
    <Button
      disabled={!!disabled}
      loading={!!loading}
      theme={[themeNames.PRIMARY_LIGHT, themeNames.PRIMARY_DARK]}
      title={I18n.t('dashboard.meterTypeButtons.action.HOT_WATER')}
      onPress={onHotWaterPress}
    />
    <Button
      secondary
      disabled={!!disabled}
      loading={!!loading}
      title={I18n.t('dashboard.meterTypeButtons.action.OTHER')}
      onPress={onOtherPress}
    />
  </>
}
