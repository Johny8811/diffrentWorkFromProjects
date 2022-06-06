// @flow

type Doc = any
declare var emit: (key: string, value?: Doc) => void

export const ddoc = {
  _id: '_design/fmcTokens',
  views: {
    findByDeviceUUID: {
      map: function (doc: *) {
        if (doc.deviceUUID) emit(doc.deviceUUID)
      }.toString(),
    },
  },
}
