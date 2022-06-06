// @flow

type Doc = any
declare var emit: (key: string, value?: Doc) => void

export const ddoc = {
  _id: '_design/referral',
  views: {
    findByReferralId: {
      map: function (doc) {
        if (doc.referralId) emit(doc.referralId)
      }.toString(),
    },
    findByEmail: {
      map: function (doc) {
        if (doc.email) {
          emit(doc.email)
        }
      }.toString(),
    },
  },
}
