/**
 * @Date: 2019-08-02T18:08:96+02:00
 * @flow
 **/

import { ObjectUtils } from '../../Utils'

const sumArrayReducer = (accumulator: number, currentValue: number): number => (accumulator + currentValue)

const sumArray = (array: number[]): number => array.reduce(sumArrayReducer, 0)

export const sumCountsMap = (countsMap: {[string]: number }): number => sumArray(ObjectUtils.objectValues(countsMap))
