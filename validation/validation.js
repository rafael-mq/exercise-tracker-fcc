const _ = require('lodash')

const validation = function (query) {
  if (_.isUndefined(query.userId)) {
    return { error: 'Unable to get userId' }
  } else {
    var userId = query.userId
  }

  let fromDate = 0
  if (_.isUndefined(query.from)) {
    // If no date from limit is informed it is assumed to UTC date
    fromDate = new Date(0).setUTCHours(0, 0, 0, 0)
  } else {
    try {
      fromDate = Date.parse(query.from)
    } catch (error) {
      return { error: 'Unable to parse from date' }
    }
  }

  let toDate = 0
  if (_.isUndefined(query.to)) {
    toDate = new Date().setUTCHours(0, 0, 0, 0)
  } else {
    try {
      toDate = Date.parse(query.to)
    } catch (error) {
      return { error: 'Unable to parse to date' }
    }
  }

  if (fromDate > toDate) {
    return { error: 'From date is greater than to date' }
  }

  let limit = 0

  return { userId, fromDate, toDate, lmt }
}

module.exports = { validation }
