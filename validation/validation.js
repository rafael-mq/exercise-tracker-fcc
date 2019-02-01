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
    fromDate = Date.parse(query.from)
    if (isNaN(fromDate)) {
      return { error: 'Unable to parse from date' }
    }
  }

  let toDate = 0
  if (_.isUndefined(query.to)) {
    toDate = new Date().setUTCHours(0, 0, 0, 0)
  } else {
    toDate = Date.parse(query.to)
    if (isNaN(toDate)) {
      return { error: 'Unable to parse to date' }
    }
  }

  if (fromDate > toDate) {
    return { error: 'From date is greater than to date' }
  }

  let lmt = 0
  if (_.isUndefined(query.limit)) {
    lmt = 1000
  } else if (isNaN(query.limit)) {
    return { error: 'Limit is not a number' }
  } else {
    lmt = Number(query.limit)
  }

  return { userId, fromDate, toDate, lmt }
}

module.exports = { validation }
