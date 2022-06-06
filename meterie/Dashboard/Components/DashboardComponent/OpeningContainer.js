/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-02T10:01:35+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'
import {
  Animated,
  StatusBar,
  StyleSheet,
} from 'react-native'

import { Container } from '../../../Common/Components'
import {
  type ThemeProps,
  themeNames,
} from '../../../Common/Theme'
import { useDimensions } from '../../../Dimensions'
import { StatusBarSafeAreaView } from '../DashboardComponent/StatusBarSafeAreaView'

const openPosition: Animated.Value = new Animated.Value(0)

type Props = $Exact<{
  +children: React.Node,
  +closedStatusBarTheme?: $ElementType<ThemeProps, 'theme'>,
  +isClosedStatusBarLight?: boolean,
  +isOpen: boolean,
  +isOpenStatusBarLight?: boolean,
  +openChildren: React.Node,
  +openStatusBarTheme?: $ElementType<ThemeProps, 'theme'>,
}>

export const OpeningContainer = ({
  children,
  closedStatusBarTheme: maybeClosedStatusBarTheme,
  isClosedStatusBarLight = true,
  isOpen,
  isOpenStatusBarLight = true,
  openChildren,
  openStatusBarTheme: maybeOpenStatusBarTheme,
}: Props) => {
  const {
    isLandscape,
    isLargeDevice,
    screenHeight,
  } = useDimensions()

  const closedStatusBarTheme = maybeClosedStatusBarTheme || [themeNames.LIGHT, themeNames.DARK]
  const openStatusBarTheme = maybeOpenStatusBarTheme || [themeNames.LIGHT, themeNames.DARK]

  React.useEffect(() => {
    Animated.timing(
      openPosition,
      {
        duration: 300,
        toValue: isOpen ? 1 : 0,
        useNativeDriver: true,
      },
    ).start()
  }, [isOpen])

  return <Container
    flex={1}
    theme={themeNames.DARK}
  >
    <StatusBar
      animated
      barStyle={isOpen
        ? isOpenStatusBarLight ? 'dark-content' : 'light-content'
        : isClosedStatusBarLight ? 'dark-content' : 'light-content'}
      hidden={isLandscape && !isLargeDevice}
      showHideTransition='slide'
    />
    <StatusBarSafeAreaView
      theme={isOpen
        ? openStatusBarTheme
        : closedStatusBarTheme}
    />
    <Animated.View
      style={[
        commonStyles.settingsPanelContainer,
        {
          opacity: openPosition.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ([0, 0, 1]: number[]),
          }),
          transform: [{
            translateY: openPosition.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ([100, 100, 0]: number[]),
            }),
          }],

        },
      ]}
    >
      {openChildren}
    </Animated.View>
    <Animated.View
      style={[
        commonStyles.expand,
        {
          transform: [{
            translateY: openPosition.interpolate({
              inputRange: [0, 1],
              outputRange: ([0, screenHeight]: number[]),
            }),
          }],
        },
      ]}
    >
      {children}
    </Animated.View>
  </Container>
}

const commonStyles = StyleSheet.create({
  expand: {
    flexGrow: 1,
    flexShrink: 1,
  },
  settingsPanelContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
})
