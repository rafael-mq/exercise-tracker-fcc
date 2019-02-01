const { User, Exercise } = require('./../../mongoose/mongoose')

const { ObjectID } = require('mongodb')

const dummyId = new ObjectID()
const dummyUser = new User({
  username: 'dummyUser',
  _id: dummyId
})

const populateUsers = () => User.deleteMany({}).then(() => dummyUser.save())

const populateExercises = () => {
  const exercises = []

  for (let i = 10; i < 20; i++) {
    exercises.push({
      userId: dummyId,
      duration: '30',
      description: 'corrida',
      date: Date.parse(`2018-12-${i}`)
    })
  }

  return Exercise.deleteMany({}).then(() => Exercise.insertMany(exercises))
}

module.exports = { populateUsers, populateExercises, dummyUser, dummyId }
