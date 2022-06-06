/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-01-02T11:01:27+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'
import SafeAreaView from 'react-native-safe-area-view'

import { View } from '../../../Common/Components'

const statusBarSafeAreaViewForceInset = Object.freeze({
  bottom: 'never',
  left: 'always',
  right: 'always',
  top: 'always',
})

type Props = {}

export const StatusBarSafeAreaView = React.memo<Props>((props: Props) => <View {...props}>
  <SafeAreaView
    forceInset={statusBarSafeAreaViewForceInset}
  />
</View>)

StatusBarSafeAreaView.displayName = 'StatusBarSafeAreaView'
