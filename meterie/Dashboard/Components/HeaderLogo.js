// @flow

import * as React from 'react'
import { StyleSheet } from 'react-native'

import { View } from '../../Common/Components/Layout/View'
import { SvgImage } from '../../Common/Components/Svg/SvgImage'
import { Strong } from '../../Common/Components/Typography/Strong'
import { Title } from '../../Common/Components/Typography/Title'
import { I18n } from '../../Common/I18n'
import { themeNames } from '../../Common/Theme'

type Props = $Exact<{
  onlySymbol?: boolean,
}>

// TODO: Fix
// eslint-disable-next-line flowtype/require-readonly-react-props, react/prefer-stateless-function
export class HeaderLogo extends React.PureComponent<Props> {
  render () {
    const { onlySymbol } = this.props

    return (
      <View
        alignItems='center'
        alignSelf='center'
        flexDirection='row'
        justifyContent='center'
      >
        <SvgImage
          name='LogoInCircle'
          size={26}
        />
        {!onlySymbol && <Title align='center' style={styles.title}>{I18n.t('dashboard.headerLogo.title.METERIE')}</Title>}
        {__DEV__ && <View
          borderRadius={1}
          justifyContent='center'
          theme={[themeNames.DANGER_LIGHT, themeNames.DANGER_DARK]}
        >
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <Strong>DEV</Strong>{/* i18n-ignore */}
        </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: -4,
  },
})
