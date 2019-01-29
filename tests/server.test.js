/* eslint-disable no-undef */
// External dependencies imports
const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

// Internal dependencies imports
const { app } = require('./../server')
const { User } = require('./../mongoose/mongoose')

describe('Users Tests', function () {
  this.timeout(10000)
  const dummyUser = new User({
    username: 'dummy'
  })

  before(done => {
    User.deleteMany({})
      .then(() => {
        return dummyUser.save()
      })
      .then(() => done())
      .catch(e => done(e))
  })

  describe('POST /api/exercise/new-user', () => {
    let username = 'caju'

    it('should create new user', done => {
      request(app)
        .post('/api/exercise/new-user')
        .send({ username })
        .expect(200)
        .expect(res => {
          expect(res.body.username).toBe(username)
          expect(ObjectID.isValid(res.body._id)).toBeTruthy()
        })
        .end((err, res) => {
          if (err) { return done(err) }

          User.findOne({ username })
            .then(doc => {
              expect(doc).toBeTruthy()
              done()
            })
            .catch(e => done(e))
        })
    })

    it('should not create user with empty username', done => {
      request(app)
        .post('/api/exercise/new-user')
        .send({ username })
        .expect(400)
        .end((err) => {
          if (err) { return done(err) }
          User.countDocuments({}, (err, count) => {
            if (err) { return done(err) }
            expect(count).toBe(2)
            done()
          })
        })
    })

    it('should not create duplicated user', done => {
      request(app)
        .post('/api/exercise/new-user')
        .send({ username: '' })
        .expect(400)
        .end((err) => {
          if (err) { return done(err) }
          User.countDocuments({}, (err, count) => {
            if (err) { return done(err) }
            expect(count).toBe(2)
            done()
          })
        })
    })
  })

  describe('GET /api/exercise/users', () => {
    it('should get array of all users', done => {
      request(app)
        .get('/api/exercise/users')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2)
        })
        .end(done)
    })
  })
})
