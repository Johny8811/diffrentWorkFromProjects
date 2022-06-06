// @flow
import PouchDB from 'pouchdb'
import DeviceInfo from 'react-native-device-info'

import Config from '../../../Config'
import { Log } from '../../Common/Log'
import { getStoredAnalyticsId } from '../../Dashboard/AsyncStorage'
import { generateReferralId } from './Helpers'
import { ddoc } from './Indexes'
import type {
  Referral,
} from './Types'

const inspector = new Log('Referral.Database')

const referralDb = new PouchDB(`${Config.databasesServerUrl}/referral`)

// TODO: try use mongo queries (accoding to mongod couchdb version)
referralDb
  .put(ddoc)
  .then(res => {
    inspector.log('Referral db: Indexes created ', res)

    return res
  })
  .catch(err => {
    if (err.name !== 'conflict') {
      inspector.log('Referral db: Index creation error ', err)
    }
  })

const generateUniqueReferralId = (): Promise<string> => new Promise((resolve, reject) => {
  (function findOriginalReferralId () {
    const referralId = generateReferralId(6)

    referralDb.query('referral/findByReferralId', {
      key: referralId,
    }).then(result => {
      if (result.rows.length === 0) {
        resolve(referralId)
      } else {
        findOriginalReferralId()
      }

      return result
    }).catch(err => {
      inspector.log('Query "findByReferralId" failed: ', err)
      reject(err)
    })
  })()
})

export const createReferral = async (email: string): Promise<string> => {
  const analyticsUserId: ?string = await getStoredAnalyticsId()
  const referralId = await generateUniqueReferralId()
  const referral: Referral = {
    _id: new Date().toISOString(),
    analyticsUserId,
    deviceUUID: DeviceInfo.getUniqueId(),
    email,
    referralId,
    referredBy: null,
    referrers: [],
  }

  referralDb.put(referral)
  return referralId
}

export const createReferralByReferrer = async (email: string, appReferredBy: string) => {
  inspector.log('createReferralByReferrer', {
    appReferredBy,
    email,
  })

  const analyticsUserId: ?string = await getStoredAnalyticsId()
  const referral: Referral = {
    _id: new Date().toISOString(),
    analyticsUserId,
    deviceUUID: DeviceInfo.getUniqueId(),
    email,
    referralId: null,
    referredBy: appReferredBy,
    referrers: [],
  }

  return referralDb.put(referral)
}

// TODO: referral/findByEmail is used on more then one place, join it into one function for more readable code (see Dashboard/Model/Database)
export const updateReferralAddReferralId = async (email: string) => {
  const referralId = await generateUniqueReferralId()

  await referralDb.query('referral/findByEmail', {
    key: email,
    include_docs: true,
  }).then(result => {
    const doc: ?Referral = result.rows[0] ? result.rows[0].doc : null

    if (doc) {
      const newDoc = Object.assign(doc, {
        referralId,
      })

      referralDb.put(newDoc)
    }

    return result
  })

  return referralId
}

export const updateReferralReferresByReferralId = (referralId: string, email: string) => referralDb.query('referral/findByReferralId', {
  key: referralId.toUpperCase(),
  include_docs: true,
}).then(async result => {
  const deviceUUID = DeviceInfo.getUniqueId()
  const doc: ?Referral = result.rows[0] ? result.rows[0].doc : null
  let returnValue = false

  if (doc) {
    try {
      const newDoc = Object.assign(doc, {
        referrers: [
          ...doc ? doc.referrers : [], {
            id: new Date().toISOString(),
            deviceUUID,
            email,
          },
        ],
      })

      await referralDb.put(newDoc)

      returnValue = true
    } catch (error) {
      // TODO: have to be added network error for user
      returnValue = false
    }
  }

  return returnValue
}).catch(err => {
  inspector.log('Query "findByReferralId" failed: ', err)
})

export const fetchReferralByEmail = (email: string) => referralDb.query('referral/findByEmail', {
  key: email,
  include_docs: true,
}).then(result => result.rows[0] && result.rows[0].doc)
  .catch(err => {
    inspector.log('Query "findByEmail" failed: ', err)
  })

export const fetchReferralMetersCount = (email: string) => referralDb.query('referral/findByEmail', {
  key: email,
  include_docs: true,
}).then(result => result.rows[0] && result.rows[0].doc && result.rows[0].doc.referrers.length)
  .catch(err => {
    inspector.log('Query "findByEmail" failed: ', err)
  })

export const fetchAnalyticsUserId = (email: string): Promise<?string> => referralDb.query('referral/findByEmail', {
  key: email,
  include_docs: true,
}).then(result => {
  const doc = result.rows[0] && result.rows[0].doc

  return doc && doc.analyticsUserId ? doc.analyticsUserId : null
})

// TODO: this logic can be deleted after added all analytics user id to referrals in DB
export const addAnalyticsUserIdToExistingReferral = (email: string, analyticsUserId: string) => referralDb.query('referral/findByEmail', {
  key: email,
  include_docs: true,
}).then(async (result): Promise<boolean> => {
  const doc = result.rows[0] && result.rows[0].doc
  let returnValue = false

  if (doc) {
    try {
      const newDoc = Object.assign(doc, { analyticsUserId })

      await referralDb.put(newDoc)

      returnValue = true
    } catch (error) {
      returnValue = false
    }
  }

  return returnValue
})
