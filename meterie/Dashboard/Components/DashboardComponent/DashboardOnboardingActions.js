/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-31T07:01:03+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'

import {
  MaxWidthView,
  Spacer,
  Text,
  View,
} from '../../../Common/Components'
import { useRemindMeModal } from '../../../Common/Components/RemindMeModal/RemindMeModalView'
import { I18n } from '../../../Common/I18n'
import { Log } from '../../../Common/Log/LogDevelopment'
import { MeterTypeButtons } from './MeterTypeButtons'

const SECONDS_OF_INACTIVITY = __DEV__ ? 5 : 30

type Props = $Exact<{
  disabled?: boolean,
  loading?: boolean,
  onAddMeterPress: () => void,
  showRemindMe: boolean,
}>

const inspector = new Log('Dashboard.Components.DashboardComponent.DashboardOnboardingActions')

export const DashboardOnboardingActions = React.memo<Props>(({
  disabled,
  loading,
  onAddMeterPress,
  showRemindMe,
}: Props) => {
  const renders = React.useRef(0)

  renders.current += 1

  const [inactivityTimePassed, setInactivityTimePassed] = React.useState<boolean>(false)
  const alreadyPassed = React.useRef<boolean>(false)
  const inactivityTimeout = React.useRef<?TimeoutID>()

  const onInactivityTimePassed = React.useCallback(() => {
    inspector.log('onInactivityTimePassed')
    setInactivityTimePassed(true)
  }, [])

  React.useEffect(() => {
    if (showRemindMe && !inactivityTimePassed && !inactivityTimeout.current) {
      inspector.log('Setting timeout')

      inactivityTimeout.current = setTimeout(() => {
        onInactivityTimePassed()
        clearTimeout(inactivityTimeout.current)
      }, SECONDS_OF_INACTIVITY * 1000)
    }

    return () => clearTimeout(inactivityTimeout.current)
  }, [inactivityTimePassed, onInactivityTimePassed, showRemindMe])

  const [, openRemindMeModal] = useRemindMeModal()

  React.useEffect(() => {
    if (!disabled && !alreadyPassed.current && inactivityTimePassed) {
      openRemindMeModal()
      alreadyPassed.current = true
    }
  }, [disabled, inactivityTimePassed, openRemindMeModal])

  inspector.log(`RENDER#${renders.current}`)

  return <MaxWidthView
    breakpoint={MaxWidthView.breakpointWidths.S.breakpoint}
    width={MaxWidthView.breakpointWidths.S.width}
  >
    <View
      padding={3}
    >
      <Text align='center'>{I18n.t('dashboard.dashboard.text.Pick_what_you_want_to_track_COLON')}</Text>
      <Spacer />

      <MeterTypeButtons
        disabled={disabled}
        onMeterPress={onAddMeterPress}
      />
    </View>
  </MaxWidthView>
})

DashboardOnboardingActions.displayName = 'DashboardOnboardingActions'
