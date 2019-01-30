/* eslint-disable no-undef */
// External dependencies imports
const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

// Internal dependencies imports
const { app } = require('./../server')
const { User } = require('./../mongoose/mongoose')
const { Exercise } = require('./../mongoose/mongoose')

const dummyId = new ObjectID()

describe('Users Tests', function () {
  this.timeout(10000)
  const dummyUser = new User({
    username: 'dummy',
    _id: dummyId
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

describe('Exercises Tests', function () {
  after(done => {
    Exercise.deleteMany({})
      .then(() => done())
      .catch(e => done(e))
  })

  describe('POST /api/exercise/add', () => {
    let timestamp = new Date().setUTCHours(0, 0, 0, 0)

    let exercise = {
      userId: dummyId,
      description: 'academia',
      duration: 42
    }

    it('should create an exercise', done => {
      request(app)
        .post('/api/exercise/add')
        .send(exercise)
        .expect(200)
        .expect(res => {
          expect(res.body.userId).toBe(dummyId.toHexString())
          let date = new Date(res.body.date)
          expect(date - timestamp).toBe(0)
        })
        .end(err => {
          if (err) { return done(err) }
          Exercise.countDocuments({})
            .then(c => {
              expect(c).toBe(1)
              done()
            })
            .catch(e => done(e))
        })
    })

    it('should not create an exercise without required info', done => {
      request(app)
        .post('/api/exercise/add')
        .send({ userId: dummyId, description: 'lazy' })
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('Missing required data')
        })
        .end(done)
    })

    it('should not create exercise for invalid user', done => {
      request(app)
        .post('/api/exercise/add')
        .send({ userId: dummyId + 1, description: 'parkour', duration: 1 })
        .expect(400)
        .end(done)
    })
  })
})
