// @flow

import { StyleSheet } from 'react-native'

const styles = {
  scrollView: {
    flexGrow: 1,
  },
  tab: {
    width: (320 - 90) / 2,
  },
}

export const styleSheet = StyleSheet.create<typeof styles>(styles)
