const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const _ = require('lodash')

const { User, Exercise } = require('./mongoose/mongoose')
const { validation } = require('./validation/validation')

// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

// Route to create new user
app.post('/api/exercise/new-user', (req, res) => {
  let username = req.body.username
  // console.log(username)

  if (!username) {
    res.status(400).send()
  } else {
    if (req.body.username === '' || typeof username !== 'string') {
      res.status(400).send()
    }

    let user = new User({ username })
    user.save()
      .then(user => {
        res.json(user)
      })
      .catch(e => res.status(400).send(e))
  }
})

// Route to get users array
app.get('/api/exercise/users', (req, res) => {
  User.find({})
    .then(users => {
      res.status(200).json(users)
    })
    .catch(e => res.status(400).send(e))
})

// Route to add an exercise with userId, description, duration (in minutes)
// and [optionally] date
app.post('/api/exercise/add', (req, res) => {
  let body = _.pick(req.body, ['userId', 'description', 'duration'])

  if (!(typeof req.body.date === 'undefined')) {
    body.date = Date.parse(req.body.date)
  }

  if (typeof req.body.duration === 'undefined' || typeof req.body.description === 'undefined') {
    return res.status(400).json({ error: 'Missing required data' })
  }

  let exercise = new Exercise(body)

  User.findById(body.userId)
    .then(user => {
      if (!user) {
        res.status(400).json({ error: 'Unexisting user' })
        return Promise.reject(new Error('Unexisting user'))
      } else {
        return exercise.save()
      }
    })
    .then(exercise => {
      res.json(_.pick(exercise, 'userId', 'duration', 'description', 'date'))
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

// Route to get entire log of exercises of an user or part of it with time
// boundaries and/or amount limit
app.get('/api/exercise/log', (req, res) => {
  let { userId, fromDate, toDate, lmt, error } = validation(req.query)
  let user = {}

  if (!_.isUndefined(error)) {
    return res.status(400).json({ error })
  } else {
    User.findById(userId)
      .then(doc => {
        if (!doc) {
          res.status(400).json({ error: 'Unexisting user' })
          return Promise.reject(new Error('Unexisting user'))
        }
        // Mounting user object to be sent
        user = _.pick(doc, '_id', 'username')

        // return exercise query if user is found
        return Exercise.find({ userId })
      })
      .then(docs => {
        if (docs.length === 0) {
          user.count = 0
          user.log = []
        } else {
        // Filter exercise log by from and to dates
          user.log = docs.filter(exercise => {
            let from = exercise.date.getTime() >= fromDate
            let to = exercise.date.getTime() <= toDate
            return from && to
          })

          // Sort exercises by date
          user.log.sort((a, b) => a.date.getTime() - b.date.getTime())
          // Aply limit to log
          if (lmt < user.log.length) {
            user.log = user.log.slice(user.log.length - lmt)
          }
          user.count = user.log.length
        }
        return res.json(user)
      }, () => res.status(400).send())
      .catch(e => {
        console.log(e)
      })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = { app }
