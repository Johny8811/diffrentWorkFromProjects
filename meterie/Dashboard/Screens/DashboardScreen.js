/**
 * @Author: Martin Adamko <martin_adamko>
 * @Date:   2018-02-17T20:32:50+01:00
 * @flow
 */

'use strict'; // eslint-disable-line

import * as React from 'react'

import { RNUXCam } from '../../../Config/UXCamConfig'
import {
  type ScreenNavigationProp,
  routeNames,
} from '../../../Navigation'
import { MeterNavigator } from '../../../Navigation/MeterNavigator'
import { NavBar } from '../../Common/Components'
import {
  SplitView,
  useViewportIsSplit,
} from '../../Common/Components/Layout/SplitView'
import { I18n } from '../../Common/I18n'
import { Log } from '../../Common/Log'
import { themeNames } from '../../Common/Theme'
import { type MeterType } from '../../Meters/Model/Types'
import { DashboardComponent, StatusBarSafeAreaView } from '../Components/DashboardComponent'
import { OpeningContainer } from '../Components/DashboardComponent/OpeningContainer'
import { SettingsComponent } from '../Components/SettingsComponent'

type Props = ScreenNavigationProp<{}>

const inspector = new Log('Screen.Dashboard.DashboardScreen')

export const DashboardScreen = ({ navigation }: Props) => {
  const renders = React.useRef(0)

  renders.current += 1

  React.useEffect(() => {
    RNUXCam.tagScreenName('Dashboard')
  }, [])

  const viewportIsSplit = useViewportIsSplit()

  const popScreenAbove = React.useCallback(() => {
    inspector.log('navigation.goBack')
    navigation.pop()
  }, [navigation])

  const onMeterPress = React.useCallback(() => {
    if (!viewportIsSplit) {
      navigation.navigate(routeNames.METER)
    }
  }, [navigation, viewportIsSplit])

  const onAddMeterPress = React.useCallback((meterType?: MeterType) => {
    navigation.navigate(routeNames.ADD_METER, { meterType })
  }, [navigation])

  const onScanButtonPress = React.useCallback(() => {
    navigation.navigate(routeNames.SCANNER)
  }, [navigation])

  const onUpgradePress = React.useCallback(() => {
    navigation.navigate(routeNames.UNLOCK)
  }, [navigation])

  const onSharePress = React.useCallback(() => {
    navigation.navigate(routeNames.SHARE_WITH_PROMO_CODE)
  }, [navigation])

  const [openSettings, setOpenSettings] = React.useState(false)

  const onOpenSettingsPress = React.useCallback(() => { setOpenSettings(true) }, [])
  const onCloseSettingsPress = React.useCallback(() => { setOpenSettings(false) }, [])

  const closeButtonProps = React.useMemo(() => ({
    onPress: onCloseSettingsPress,
  }), [onCloseSettingsPress])

  inspector.log(`RENDER#${renders.current}`)

  const dashboardContent = <OpeningContainer
    closedStatusBarTheme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}
    isOpen={openSettings}
    isOpenStatusBarLight={false}
    openChildren={<>
      <StatusBarSafeAreaView theme={[themeNames.DARK, themeNames.DARK]} />
      <NavBar
        rightButton={closeButtonProps}
        title={I18n.t('dashboard.dashboard.title.SETTINGS')}
        touchesLeft={false}
        touchesRight={false}
        touchesTop={false}
      />

      <SettingsComponent
        visible={openSettings}
        onSharePress={onSharePress}
        onUpgradePress={onUpgradePress}
      />
    </>}
  >
    <DashboardComponent
      isOpen={!openSettings}
      popScreenAbove={popScreenAbove}
      viewportIsSplit={viewportIsSplit}
      onAddMeterPress={onAddMeterPress}
      onMeterPress={onMeterPress}
      onOpenSettingsPress={onOpenSettingsPress}
      onScanButtonPress={onScanButtonPress}
      onSharePress={onSharePress}
      onUpgradePress={onUpgradePress}
    />
  </OpeningContainer>

  return <SplitView
    primary={dashboardContent}
    primaryColumnWidthFraction={0.6}
    secondary={<MeterNavigator />}
  />
}

DashboardScreen.navigationOptions = {
  header: null,
}
