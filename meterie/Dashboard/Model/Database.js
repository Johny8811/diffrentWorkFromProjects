// @flow
import PouchDB from 'pouchdb'
import DeviceInfo from 'react-native-device-info'

import Config from '../../../Config'
import { Log } from '../../Common/Log'
import { ddoc } from './Indexes'
import type { FmcTokenRecord } from './Types'

const inspector = new Log('Dashboard.Model.Database')

const RETURN_DOC = true
const deviceUUID = DeviceInfo.getUniqueId()

const fmcTokensDb = new PouchDB(`${Config.databasesServerUrl}/fmc_tokens`)

// TODO: try use mongo queries (accoding to mongod couchdb version).
fmcTokensDb
  .put(ddoc)
  .then(res => {
    inspector.log('FmcTokens db: Indexes created ', res)

    return res
  })
  .catch(err => {
    if (err.name !== 'conflict') {
      inspector.log('FmcTokens db: Index creation error ', err)
    }
  })

const findByDeviceUUID = (
  deviceUUID: $PropertyType<FmcTokenRecord, 'deviceUUID'>,
  includeDoc: boolean = false
) => fmcTokensDb.query('fmcTokens/findByDeviceUUID', {
  key: deviceUUID,
  include_docs: includeDoc,
}).catch(e => {
  inspector.log('Query "findByDeviceUUID" failed ', e)
})

export const fmcTokenOfDeviceUuidExistInDB = () => findByDeviceUUID(deviceUUID)
  .then(result => !!result.rows.length)
  .catch(e => {
    inspector.log('"fmcTokenOfDeviceUuidExistInDB" error ', e)
  })

export const addFMCToken = (fmcToken: string) => {
  const dateNowIsoString = new Date().toISOString()
  const fmcTokenRecord: FmcTokenRecord = {
    _id: dateNowIsoString,
    dateCreated: dateNowIsoString,
    fmcToken,
    deviceUUID,
    lastAppUse: dateNowIsoString,
    notificationPermissionsAllowed: null,
  }

  return fmcTokensDb.put(fmcTokenRecord)
}

export const updateLastAppUsageAndNotificationsPermissions = (notificationPermissionsAllowed: boolean) => findByDeviceUUID(deviceUUID, RETURN_DOC)
  .then(async result => {
    const dateNowIsoString = new Date().toISOString()
    const doc: ?FmcTokenRecord = result.rows[0] ? result.rows[0].doc : null

    if (doc) {
      const newDoc = Object.assign(doc, {
        lastAppUse: dateNowIsoString,
        notificationPermissionsAllowed,
      })

      fmcTokensDb.put(newDoc).catch(error => inspector.log('"updateLastAppUsage" put to DB error: ', error))
    }

    return result
  })
  .catch(e => {
    inspector.log('"updateLastAppUse" error ', e)
  })
