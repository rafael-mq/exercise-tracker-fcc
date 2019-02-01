/* eslint-disable no-undef */
const expect = require('expect')

const { validation } = require('./../validation/validation')

describe('Validation function tests', () => {
  it('should identify undefined user', () => {
    expect(validation({
      from: '2018-01-01',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('error', 'Unable to get userId')
  })

  it('should assume UTC date if no from is informed', () => {
    expect(validation({
      userId: 'dummyUserId',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('fromDate', new Date(0).setUTCHours(0, 0, 0, 0))
  })

  it('should fail to parse invalid from date', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-20-20',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('error', 'Unable to parse from date')
  })

  it('should assume current date if no to is informed', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      limit: '10'
    })).toHaveProperty('toDate', new Date().setUTCHours(0, 0, 0, 0))
  })

  it('should fail to parse invalid to date', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019_01.01',
      limit: '10'
    })).toHaveProperty('error', 'Unable to parse to date')
  })

  it('should accuse if from date is greater than to date', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2019-01-01',
      to: '2018-01-01',
      limit: '10'
    })).toHaveProperty('error', 'From date is greater than to date')
  })

  it('should set default limit of 1000 if not informed', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01'
    })).toHaveProperty('lmt', 1000)
  })

  it('should accuse if limit informed is not a number', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01',
      limit: 'ten'
    })).toHaveProperty('error', 'Limit is not a number')
  })

  it('should correctly return validated parameters', () => {
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('userId')
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('fromDate')
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('toDate')
    expect(validation({
      userId: 'dummyUserId',
      from: '2018-01-01',
      to: '2019-01-01',
      limit: '10'
    })).toHaveProperty('lmt')
  })
})
