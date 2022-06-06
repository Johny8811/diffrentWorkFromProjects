/**
 * @Created by Jan Hujsa on 18/03/2020
 * @Copyright: Jan Hujsa
 * @flow
 */
import { Platform } from 'react-native'

import Config from '../../../Config'
import {
  getValue,
  keys,
} from '../../../Config/RemoteConfig'

export const getFreeMetersCount = async () => {
  const freeMetersCount = await getValue(Platform.OS === 'android' ? keys.countOfFreeMetersAndroid : keys.countOfFreeMeters)

  return __DEV__ ? Config.freeMetersCount : freeMetersCount
}
