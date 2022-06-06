// @flow
import memoize from 'memoize-state'
import firebase from 'react-native-firebase'

export const generateReferralId = (length: number): string => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const createReferralLink = memoize((referralId: string) => {
  const link = new firebase.links.DynamicLink(`https://meterie.com?referralId=${referralId}`, 'https://meterie.page.link')
    .android.setPackageName('com.meterie')
    .ios.setBundleId('com.meterie')
    .ios.setAppStoreId('1462299132')
    .navigation.setForcedRedirectEnabled(true)

  return firebase.links().createShortDynamicLink(link, 'SHORT')
})
