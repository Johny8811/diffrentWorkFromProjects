/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2020-02-04T11:02:81+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'

import {
  Row,
  Spacer,
  Text,
  View,
} from '../../../Common/Components'
import { I18n } from '../../../Common/I18n'
import { type ThemeName,
  type ThemeProps,
  getThemeConfig,
  themeNames,
  useDarkModeTheme } from '../../../Common/Theme'
import { RNView } from '../../../ReactNative/RNView'
import { createNewStyleReference } from '../../../Theme/Helpers'

const steps = [
  () => I18n.t('dashboard.howItWorks.steps.Start_by_adding_an_utility_meter'),
  () => I18n.t('dashboard.howItWorks.steps.Use_reminders_to_add_values_regularily'),
  () => I18n.t('dashboard.howItWorks.steps.Track_and_control_your_consumption'),
]

type Props = $Exact<{
  ...ThemeProps,
  +bulletTheme?: $PropertyType<ThemeProps, 'theme'>,
}>

const BULLET_SIZE = 32

export const HowItWorks = React.memo<Props>(({
  bulletTheme: bulletThemeProp,
  theme: themeProp,
}: Props) => {
  const [, ThemeProvider] = useDarkModeTheme(themeProp)
  const [bulletTheme] = useDarkModeTheme(bulletThemeProp || [themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK])

  const renderStep = (step: () => string, index: number) => <Row
    key={`step-${index}`}
    align='flex-start'
    verticalAlign='stretch'
  >
    <RNView alignItems='center'>
      <NumberBullet theme={bulletTheme}>{index + 1}</NumberBullet>
      {index < steps.length - 1 && <StepConnector theme={bulletTheme} />}
    </RNView>

    <Spacer />

    <Text flexShrink={1}>{step()}</Text>
  </Row>

  const content = <RNView>{steps.map(renderStep)}</RNView>

  return themeProp
    ? <ThemeProvider theme={themeProp}>{content}</ThemeProvider>
    : content
})

HowItWorks.displayName = 'HowItWorks'

type StepConnectorProps = $Exact<{
  theme: ThemeName,
}>

const StepConnector = React.memo<StepConnectorProps>(({ theme }: StepConnectorProps) => {
  const style = React.useMemo(() => {
    const {
      colors,
      metrics,
    } = getThemeConfig(theme)

    return createNewStyleReference({
      backgroundColor: colors.primary,
      minHeight: metrics.spacing.vertical * 2,
    })
  }, [theme])

  return <RNView flexGrow={1} style={style} width={2} />
})

StepConnector.displayName = 'StepConnector'

type NumberBulletProps = $Exact<{
  children: number,
  theme: ThemeName,
}>

const NumberBullet = React.memo<NumberBulletProps>(({ children, theme }: NumberBulletProps) => {
  const [style, textStyle] = React.useMemo(() => {
    const { colors, metrics } = getThemeConfig(theme)

    return [
      createNewStyleReference({
        borderColor: colors.primary,
        height: BULLET_SIZE,
        width: BULLET_SIZE,
      }),
      createNewStyleReference({
        color: colors.primary,
      }),
    ]
  }, [theme])

  return <View
    alignItems='center'
    borderRadius={BULLET_SIZE / 2}
    borderWidth={2}
    justifyContent='center'
    style={style}
  >
    <Text caption strong style={textStyle}>{children}</Text>
  </View>
})

NumberBullet.displayName = 'NumberBullet'
