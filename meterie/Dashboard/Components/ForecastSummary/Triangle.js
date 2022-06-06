/**
 * @Date: 2019-08-19T14:08:87+02:00
 * @flow
**/

import * as React from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import {
  elevateColor,
  View,
} from '../../../Common/Components/Layout/View'
import {
  type ThemeProps,
  getThemeConfig,
  useDarkModeTheme,
} from '../../../Common/Theme'
import { type ViewStyleProp } from '../../../ReactNative/Types'

type Props = $Exact<{
  ...ThemeProps,
  +height?: number,
  +style?: ViewStyleProp,
  +width?: number,
}>

export const Triangle = React.memo<Props>(({
  height = 9, style,
  theme: themeProp,
  width = 13,
  ...props
}: Props) => {
  const [theme] = useDarkModeTheme(themeProp)
  const themeConfig = getThemeConfig(theme)
  const fill = elevateColor(themeConfig.colors?.background)

  return (
    <View
      {...props}
      style={[styles.triangle, { height, width }, style]}
    >
      <Svg
        height={height}
        width={width}
      >
        <Path
          d='M0 0h13L6.5 9z'
          fill={fill}
          fillRule='evenodd'
        />
      </Svg>
    </View>
  )
})

Triangle.displayName = 'Triangle'

// TODO: Replace with transparent from colors
const transparent = 'transparent'

const styles = StyleSheet.create({
  triangle: {
    backgroundColor: transparent,
    bottom: 6,
    height: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    width: 0,
  },
})
