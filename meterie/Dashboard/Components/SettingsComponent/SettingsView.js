/**
 * @Author: Martin Adamko <martinadamko.sk@gmail.com>
 * @Date: 2019-09-30T17:09:32+02:00
 * @Copyright: Martin Adamko
 * @flow
**/

import * as React from 'react'
import { withNavigationFocus } from 'react-navigation'

import Config from '../../../../Config'
import {
  ActionContainer,
  AppVersion,
  Button,
  Heading,
  MaxWidthView,
  Row,
  Spacer,
  SvgImage,
  Text,
  View,
} from '../../../Common/Components'
import { useRemindMeModal } from '../../../Common/Components/RemindMeModal/RemindMeModalView'
import { useSetCurrencyModal } from '../../../Common/Components/SetCurrencyModal'
import { I18n } from '../../../Common/I18n'
import { themeNames } from '../../../Common/Theme'
import * as Prompt from '../../../Identity/Prompt'
import { LocaleSection } from '../../../Locale'
import { Api as PermissionsApi } from '../../../Permissions/Api'
import { type Props as ViewProps } from './Types'

const handleStartFlowToGetFreeMeter = () => { Prompt.prompt(Prompt.conditions.FREE_METER_GAINED) }
const handleStartFlowToGenerateReferralId = () => { Prompt.prompt(Prompt.conditions.REFERRAL_ID_IS_SET) }

type HocProps = $Exact<{
  +isFocused: boolean | void,
}>

type Props = $Exact<{
  ...HocProps,
  ...ViewProps,
}>

export const SettingsViewComponent = React.memo<Props>(({
  appReferredBy,
  cameraAllowed,
  cameraRollAllowed,
  checkCameraPermissions,
  checkCameraRollPermissions,
  checkNotificationsPermissions,
  freshlyInstalled,
  gettingCameraPermissions,
  gettingCameraRollPermissions,
  gettingNotificationsPermissions,
  hasInfiniteNumberOfMeters,
  initialCurrency,
  isFocused,
  metersLoading,
  notificationsAllowed,
  onSharePress,
  onUpgradePress,
  referralId,
  referredBy,
  requestCameraPermissions,
  requestCameraRollPermissions,
  requestNotificationsPermissions,
  updateMeterCurrenciesLoading,
  visible,
}: Props) => {
  const [, openRemindMe] = useRemindMeModal()

  React.useEffect(() => {
    checkCameraPermissions()
    checkCameraRollPermissions()
    checkNotificationsPermissions()
  }, [checkCameraPermissions, checkCameraRollPermissions, checkNotificationsPermissions])

  const actionsFactory = React.useCallback(({
    hasInfiniteNumberOfMeters,
    isFocused,
    onSharePress,
    onUpgradePress,
  }: *) => {
    const actions = []

    if (Config.inAppFeatureReady) {
      actions.push({
        disabled: !isFocused,
        onPress: onUpgradePress,
        theme: [themeNames.SUCCESS_LIGHT, themeNames.SUCCESS_DARK],
        title: hasInfiniteNumberOfMeters
          ? I18n.t('dashboard.settings.action.YOUR_PURCHASE')
          : I18n.t('dashboard.settings.action.SUBSCRIBE_OR_RESTORE_PURCHASE'),
      })
    }

    actions.push({
      disabled: !isFocused,
      onPress: onSharePress,
      // TODO: Remove prop when feature condition is unnecessary
      theme: Config.inAppFeatureReady ? undefined : [themeNames.SUCCESS_LIGHT, themeNames.SUCCESS_DARK],
      title: I18n.t('dashboard.settings.action.SHARE_AND_GET_FREE_METERS'),
    })

    return actions
  }, [])

  const cameraPermissionsAsked = PermissionsApi.isPermissionAsked(cameraAllowed)
  const cameraRollPermissionsAsked = PermissionsApi.isPermissionAsked(cameraRollAllowed)
  const notificationsPermissionsAsked = PermissionsApi.isPermissionAsked(notificationsAllowed)
  const userCanEnterPromoCode = !appReferredBy && freshlyInstalled && !(referralId || referredBy)

  return <ActionContainer
    actions={actionsFactory({
      hasInfiniteNumberOfMeters,
      isFocused,
      onSharePress,
      onUpgradePress,
    })}
    backgroundGradientTheme={[themeNames.PRIMARY_ON_LIGHT, themeNames.PRIMARY_ON_DARK]}
    id='settings'
    showNavBar={false}
    showOr={Config.inAppFeatureReady}
  >
    <MaxWidthView
      breakpoint={MaxWidthView.breakpointWidths.S.breakpoint}
      flexGrow={1}
      width={MaxWidthView.breakpointWidths.S.width}
    >
      {userCanEnterPromoCode && <>
        <View paddingHorizontal={3}>
          <View borderRadius={6} paddingHorizontal={3} paddingVertical={2} theme={themeNames.PRIMARY_ON_LIGHT}>
            <Heading>{I18n.t('dashboard.settings.heading.YOUR_FRIEND_QUOTE_S_PROMOCODE')}</Heading>

            <Spacer height={1} />

            <Row align='flex-start' paddingVertical={1}>
              <Text caption>{I18n.t('dashboard.settings.text.Did_you_want_to_install_the_app_with_your_friend_QUOTE_s_promocode_QUESTIONMARK')}</Text>
            </Row>

            <Button
              secondary
              small
              disabled={!isFocused}
              title={I18n.t('general.actions.action.I_HAVE_A_PROMO_CODE')}
              onPress={handleStartFlowToGetFreeMeter}
            />
          </View>
        </View>
        <Spacer height={3} />
      </>}

      <LocaleSection />

      {appReferredBy && <View paddingHorizontal={3} paddingVertical={3}>
        <Row wrap align='flex-start' paddingVertical={1}>
          <SvgImage
            name='CheckmarkCircle'
            theme={referredBy
              ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
              : undefined}
          />
          <Heading>{I18n.t('dashboard.settings.heading.YOUR_FREE_METER')}</Heading>
        </Row>

        <Row align='flex-start' paddingVertical={1}>
          <Text caption>
            {referredBy
              ? I18n.t('dashboard.settings.text.You_have_successfully_installed_the_app_with_your_friend_QUOTE_s_promo_code_and_confirmed_your_email_DOT_You_both_got_a_free_meter_DOT_Want_more_QUESTIONMARK_Share_the_app_with_your_own_promocode_DOT')
              : I18n.t('dashboard.settings.text.You_have_successfully_installed_the_app_with_your_friend_QUOTE_s_promo_code_DOT_You_both_can_get_a_free_meter_once_you_confirm_your_email_DOT')}
          </Text>
        </Row>

        {!referredBy && <Button
          secondary
          small
          disabled={!isFocused}
          title={I18n.t('general.actions.action.CONFIRM_EMAIL_AND_GET_A_FREE_METER')}
          onPress={handleStartFlowToGetFreeMeter}
        />}
      </View>}

      {initialCurrency && <CurrencySection
        initialCurrency={initialCurrency}
        metersLoading={metersLoading}
        updateMeterCurrenciesLoading={updateMeterCurrenciesLoading}
      />}

      <View paddingHorizontal={3} paddingVertical={3}>
        <Row wrap align='flex-start' paddingVertical={1}>
          <SvgImage
            name={notificationsAllowed
              ? 'CheckmarkCircle'
              : 'CrossCircle'}
            theme={notificationsPermissionsAsked
              ? notificationsAllowed
                ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
                : [themeNames.DANGER_ON_LIGHT, themeNames.DANGER_ON_DARK]
              : undefined}
          />
          <Heading>{I18n.t('dashboard.settings.heading.NOTIFICATIONS')}</Heading>
        </Row>

        <Row align='flex-start' paddingVertical={1}>
          <Text caption>{I18n.t('dashboard.settings.text.Notifications_allows_us_to_send_you_important_reminders_like_those_to_track_your_spending_and_tips_how_to_use_less_energies_and_save_more_on_your_bill_DOT')}</Text>
        </Row>

        {notificationsAllowed
          ? <Button
            small
            theme={[themeNames.SUCCESS_LIGHT, themeNames.SUCCESS_DARK]}
            title={I18n.t('general.actions.action.SET_REMINDER')}
            onPress={openRemindMe}
          />
          : <Button
            secondary
            small
            disabled={!!gettingNotificationsPermissions}
            loading={!!gettingNotificationsPermissions}
            title={I18n.t('general.actions.action.ALLOW_NOTIFICATIONS')}
            onPress={requestNotificationsPermissions}
          />}
      </View>

      <View paddingHorizontal={3} paddingVertical={2}>
        <Row wrap align='flex-start' paddingVertical={1}>
          <SvgImage
            name={cameraAllowed
              ? 'CheckmarkCircle'
              : 'CrossCircle'}
            theme={cameraPermissionsAsked
              ? cameraAllowed
                ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
                : [themeNames.DANGER_ON_LIGHT, themeNames.DANGER_ON_DARK]
              : undefined}
          />
          <Heading>{I18n.t('dashboard.settings.heading.TAKING_PHOTOS')}</Heading>
        </Row>

        <Row align='flex-start' paddingVertical={1}>
          <Text caption>{I18n.t('dashboard.settings.text.Taking_photos_can_help_you_prove_the_bill_is_wrong_DOT_This_allows_you_to_take_the_photos_while_tracking_usage_DOT_When_you_are_on_the_WiFi_we_will_try_to_backup_the_photos_to_our_cloud_for_free_DOT')}</Text>
        </Row>

        {!cameraAllowed && <Button
          secondary
          small
          disabled={!!gettingCameraPermissions}
          loading={!!gettingCameraPermissions}
          title={I18n.t('general.actions.action.ALLOW_CAMERA')}
          onPress={requestCameraPermissions}
        />}
      </View>

      <View paddingHorizontal={3} paddingVertical={2}>
        <Row wrap align='flex-start' paddingVertical={1}>
          <SvgImage
            name={cameraRollAllowed
              ? 'CheckmarkCircle'
              : 'CrossCircle'}
            theme={cameraRollPermissionsAsked
              ? cameraRollAllowed
                ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
                : [themeNames.DANGER_ON_LIGHT, themeNames.DANGER_ON_DARK]
              : undefined}
          />
          <Heading>{I18n.t('dashboard.settings.heading.SAVING_PHOTOS')}</Heading>
        </Row>

        <Row align='flex-start' paddingVertical={1}>
          <Text caption>{I18n.t('dashboard.settings.text.When_allowed_we_can_save_the_photos_of_meters_you_take_when_taking_status_values_DOT')}</Text>
        </Row>

        {!cameraRollAllowed && <Button
          secondary
          small
          disabled={!!gettingCameraRollPermissions}
          loading={!!gettingCameraRollPermissions}
          title={I18n.t('general.actions.action.ALLOW_SAVING_PHOTOS')}
          onPress={requestCameraRollPermissions}
        />}
      </View>

      <View paddingHorizontal={3} paddingVertical={2}>
        <Row wrap align='flex-start' paddingVertical={1}>
          <SvgImage
            name={referralId
              ? 'CheckmarkCircle'
              : 'CrossCircle'}
            theme={referralId
              ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
              : undefined}
          />
          <Heading>{I18n.t('dashboard.settings.heading.YOUR_OWN_PROMOCODE')}</Heading>
          <View flexGrow={1} />
          {referralId
            ? <View
              pill
              alignSelf='center'
              theme={[themeNames.PRIMARY_LIGHT, themeNames.PRIMARY_DARK]}
            >
              <Text caption strong align='center' letterSpacing={2}>{referralId}</Text>
            </View>
            : null}
        </Row>

        <Row align='flex-start' paddingVertical={1}>
          <Text caption>{I18n.t('dashboard.settings.text.When_you_share_this_app_with_a_friend_you_both_get_a_free_meter_once_they_confirm_their_email_DOT')}</Text>
        </Row>

        {!referralId && <Button
          secondary
          small
          title={I18n.t('general.actions.action.GET_YOUR_OWN_PROMOCODE')}
          onPress={handleStartFlowToGenerateReferralId}
        />}
      </View>
    </MaxWidthView>
    <AppVersion />
  </ActionContainer>
})

SettingsViewComponent.displayName = 'SettingsView'

export const SettingsView = withNavigationFocus(SettingsViewComponent)

const CurrencySection = ({
  initialCurrency,
  metersLoading,
  updateMeterCurrenciesLoading,
}: {
  initialCurrency: $PropertyType<Props, 'initialCurrency'>,
  metersLoading: $PropertyType<Props, 'metersLoading'>,
  updateMeterCurrenciesLoading: $PropertyType<Props, 'updateMeterCurrenciesLoading'>,
}) => {
  const [isSetCurrencyModalVisible, showSetCurrencyModal] = useSetCurrencyModal()

  const isLoading = isSetCurrencyModalVisible || metersLoading || updateMeterCurrenciesLoading

  return <View paddingHorizontal={3} paddingVertical={3}>
    <Row wrap align='flex-start' paddingVertical={1}>
      <SvgImage
        name='CheckmarkCircle'
        theme={initialCurrency
          ? [themeNames.SUCCESS_ON_LIGHT, themeNames.SUCCESS_ON_DARK]
          : undefined}
      />
      <Heading>{I18n.t('dashboard.settings.heading.YOUR_CURRENCY_COLON')}</Heading>
      <Spacer flexGrow={1} />
      <Text>{initialCurrency}</Text>
    </Row>

    <Row align='flex-start' paddingVertical={1}>
      <Text caption>{I18n.t('dashboard.settings.text.This_is_the_global_currency_we_use_to_display_prices_in_the_app_DOT')}</Text>
    </Row>

    <Button
      small
      disabled={!!isLoading}
      loading={!!isLoading}
      theme={[themeNames.SUCCESS_LIGHT, themeNames.SUCCESS_DARK]}
      title={I18n.t('dashboard.settings.actions.SET_CURRENCY')}
      onPress={showSetCurrencyModal}
    />
  </View>
}
