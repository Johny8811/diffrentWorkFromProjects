/**
 * @flow
 */

'use strict'; // eslint-disable-line

import * as React from 'react'
import {
  StyleSheet,
} from 'react-native'

import {
  FittingView,
  Spacer,
  Strong,
  SvgImage,
  Text,
  View,
} from '../../../Common/Components'
import { I18n } from '../../../Common/I18n'
import {
  reasonableDigits,
  splitPriceLocaleString,
} from '../../../Common/I18n/Helpers'
import { Log } from '../../../Common/Log'
import {
  type ThemeName,
  themeNames,
} from '../../../Common/Theme'
import {
  type IsoDateString,
  type TimeRange,
  timeRanges,
} from '../../../Common/Types'
import { type ConsumptionPriceNativityTuple } from '../../../Measurements/Model/TypesNext'
import { getCurrentPeriodLabels } from '../../../Meters/Model/Helpers'
import { RNView } from '../../../ReactNative/RNView'
import {
  type DisplayUnit,
  displayUnits,
} from '../../Model/Types'

type Props = $Exact<{
  +currency: string,
  +currentValue: ?ConsumptionPriceNativityTuple,
  +displayUnit?: DisplayUnit,
  +previousTimeRangeDate: IsoDateString,
  +previousValue: ?ConsumptionPriceNativityTuple,
  +signsTheme?: ThemeName,
  +timeRange: TimeRange,
  +timeRangeDate: IsoDateString,
}>

const console = new Log('Dashboard.Components.ForecastSummary')

// TODO: Fix
// eslint-disable-next-line flowtype/require-readonly-react-props
export class ForecastSummary extends React.PureComponent<Props> {
  _asCurrencyWithSign = (value: number, currency: string): string => (value > 0 ? '+' : '') + this._asCurrency({ currency, value })

  _asPercentWithSign = (value: number): string => (value > 0 ? '+' : '') + this._asPercent(value)

  _asCurrency = ({
    currency,
    precision,
    value,
  }: {
    currency: ?string,
    precision?: number,
    value: number,
  }) => I18n.toLocalePrice(
    value,
    I18n.getNumberFormatOptions({
      currency: currency || undefined,
      precision: typeof precision === 'number' ? precision : reasonableDigits(value),
    })
  )

  _asPercent = (value: number) => I18n.toLocalePercent(value, I18n.getNumberFormatOptions({ precision: reasonableDigits(value * 100) })).replace(/\s/, '\u2009')

  _roundTo4Decimals = (value: number) => Math.round(value * 10000) / 10000

  render () {
    const {
      currency,
      currentValue,
      displayUnit = displayUnits.PHYSICAL, // TODO: Show physical units
      previousTimeRangeDate,
      previousValue,
      signsTheme,
      timeRange,
      timeRangeDate,
      ...props
    } = this.props

    const currentPeriodLabels = getCurrentPeriodLabels(timeRangeDate)
    const previousPeriodLabels = getCurrentPeriodLabels(previousTimeRangeDate)

    const monthLabel = currentPeriodLabels[timeRanges.MONTH]
    const yearLabel = currentPeriodLabels[timeRanges.YEAR]

    const previousMonthLabel = previousPeriodLabels[timeRanges.MONTH]
    const previousYearLabel = previousPeriodLabels[timeRanges.YEAR]

    const [, currentPrice] = currentValue || []
    const [, previousPrice] = previousValue || []

    console.log('RENDER')

    const difference = previousPrice && currentPrice ? this._roundTo4Decimals(currentPrice - previousPrice) : null
    const differenceAsPercents = previousPrice && difference ? (difference / previousPrice) : null

    const direction = !difference ? 0 : difference > 0 ? 1 : -1

    const formattedCurrentPrice = this._asCurrency({
      currency,
      value: Math.abs(currentPrice || 0),
    })
    const currentPriceCurrentPriceReasonableDigits = reasonableDigits(currentPrice || 0)

    const formattedCurrentPriceParts = splitPriceLocaleString(formattedCurrentPrice, currentPriceCurrentPriceReasonableDigits)

    const formattedCurrentPricePrefix = formattedCurrentPriceParts?.prefix
    const formattedCurrentPriceSignificantDigits = formattedCurrentPriceParts?.significant
    const formattedCurrentPriceFractionDigits = formattedCurrentPriceParts?.fraction
    const formattedCurrentSuffix = formattedCurrentPriceParts?.suffix

    // const emptyFractionDigits = I18n.toLocaleString(0, { minimumFractionDigits: 1 }).substring(1).replace(/\d/g, '–')

    return <>
      <View
        {...props}
        alignItems='stretch'
        flexDirection='row'
        justifyContent='space-between'
      >
        <RNView flex={1} justifyContent='space-between'>
          <Price
            // emptyFractionDigits={emptyFractionDigits}
            formattedCurrentPriceFractionDigits={formattedCurrentPriceFractionDigits}
            formattedCurrentPricePrefix={formattedCurrentPricePrefix}
            formattedCurrentPriceSignificantDigits={formattedCurrentPriceSignificantDigits}
            formattedCurrentSuffix={formattedCurrentSuffix}
          />
          <Text caption strong>{I18n.t('dashboard.forecastSummary.label.your_usage')}</Text>
        </RNView>
        <RNView alignItems='center' justifyContent='center' width={50}>
          <View alignItems='center' borderRadius={50} height={50} justifyContent='center' theme={[themeNames.LIGHT, themeNames.DARK]} width={50}>
            {direction === 1 ? <SvgImage name='DirectionUp' />
              : direction === -1 ? <SvgImage name='DirectionDown' />
                : <SvgImage name='DirectionNone' />}
          </View>
        </RNView>
        <RNView
          alignItems='flex-end'
          flex={1}
          justifyContent='space-between'
        >
          {difference
            ? <Strong style={styles.difference} theme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}>
              <Text
                style={styles.differenceSign}
                theme={difference > 0
                  ? signsTheme || [themeNames.DANGER_ON_LIGHT, themeNames.DANGER_ON_DARK]
                  : signsTheme || [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]}
              >
                { this._asCurrencyWithSign(difference, currency).substring(0, 1) }
              </Text>
              { this._asCurrencyWithSign(difference, currency).substring(1) }
            </Strong>
            : <Strong style={styles.differenceDisabled}>
              {'±' + this._asCurrency({ currency, precision: 0, value: 0 })}
            </Strong>}
          {differenceAsPercents
            ? <Strong style={styles.difference} theme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}>
              <Text
                style={styles.differenceSign}
                theme={difference !== null && difference > 0
                  ? signsTheme || [themeNames.DANGER_ON_LIGHT, themeNames.DANGER_ON_DARK]
                  : signsTheme || [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]}
              >
                { this._asPercentWithSign(differenceAsPercents).substring(0, 1) }
              </Text>
              { this._asPercentWithSign(differenceAsPercents).substring(1) }
            </Strong>
            // eslint-disable-next-line react/jsx-one-expression-per-line
            : <Strong style={styles.differenceDisabled}>±0&thinsp;%{/* i18n-ignore */}</Strong>}
          <Text caption strong align='right'>
            {I18n.tf(
              direction === 1 ? 'dashboard.forecastSummary.label.more_than_{}' // i18n
                : direction === -1 ? 'dashboard.forecastSummary.label.less_than_{}' // i18n
                  : 'dashboard.forecastSummary.label.same_as_{}', // i18n
              [timeRange === timeRanges.MONTH ? previousMonthLabel : previousYearLabel]
            )}
          </Text>
        </RNView>
      </View>
      <Spacer vertical={3} />
      <Text strong align='center'>
        {timeRange === timeRanges.MONTH
          ? `${monthLabel.toUpperCase()} ${yearLabel}`
          : I18n.tf('dashboard.forecastSummary.label.YEAR_{}', [yearLabel])}
      </Text>
    </>
  }
}

const Price = ({
  // emptyFractionDigits,
  formattedCurrentPriceFractionDigits,
  formattedCurrentPricePrefix,
  formattedCurrentPriceSignificantDigits,
  formattedCurrentSuffix,
}: {
  // emptyFractionDigits: string,
  formattedCurrentPriceFractionDigits: ?string,
  formattedCurrentPricePrefix: ?string,
  formattedCurrentPriceSignificantDigits: ?string,
  formattedCurrentSuffix: ?string,
}) => <FittingView alignItems='flex-start'>
  <View flexDirection='row' opaque={false}>
    { formattedCurrentPricePrefix ? <Strong style={styles.prefix}>{ formattedCurrentPricePrefix }</Strong> : null }
    <Strong style={styles.significantDigits}>{ formattedCurrentPriceSignificantDigits || '–' }</Strong>
    <Strong style={styles.fractionDigits}>{(formattedCurrentPriceFractionDigits || (formattedCurrentPriceSignificantDigits ? '' : '–')) + (formattedCurrentSuffix || '') }</Strong>
  </View>
</FittingView>

const styles = StyleSheet.create({
  difference: {
    fontSize: 24,
    lineHeight: 25,
  },
  differenceDisabled: {
    fontSize: 24,
    lineHeight: 25,
    opacity: 0.5,
  },
  differenceSign: {
    lineHeight: 25,
  },
  fractionDigits: {
    fontSize: 24,
    lineHeight: 35,
    marginLeft: 0,
  },
  prefix: {
    fontSize: 24,
    lineHeight: 35,
    marginRight: 0,
  },
  significantDigits: {
    fontSize: 55,
    lineHeight: 60,
    marginRight: 0,
  },
})
