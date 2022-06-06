/**
 * @Created by Jan Hujsa on 18/03/2020
 * @Copyright: Jan Hujsa
 * @flow
 */

import { type Dispatch } from 'redux'

import { type State as ReduxState } from '../../../Redux/Types'
import { withDispatchApi } from '../../../Redux/withDispatchApi'
import { setFreeMetersCount } from '../Redux/actions'
import * as Api from './Api'

export const getFreeMetersCount = withDispatchApi<number, Dispatch<*>, ReduxState>({
  resolveActions: (result: number) => [setFreeMetersCount(result)],
  service: Api.getFreeMetersCount,
})
