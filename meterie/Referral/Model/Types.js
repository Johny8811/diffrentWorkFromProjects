// @flow
import { Moment } from '../../Common/I18n'

type Referrer = {
  deviceUUID: string,
  email: string,
}

export type Referral = {
  _id: string,
  analyticsUserId: ?string,
  deviceUUID: string,
  email: string,
  referralId: ?string,
  referredBy: ?string,
  referrers: Referrer[],
}

export type ConfirmationMailData = {
  code: ?string,
  expirationTime: ?Moment,
}
