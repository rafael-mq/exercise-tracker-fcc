require('dotenv').config()

if (process.env.NODE_ENV === 'test') {
  process.env.MLAB_URI = 'mongodb://localhost:27017/ExerciseTrackerTest'
  process.env.PORT = 3000
}
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MLAB_URI, { useNewUrlParser: true })

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 1,
    unique: true
  }
})

var User = mongoose.model('User', UserSchema)

var Exercise = mongoose.model('Exercise', {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: new Date().setUTCHours(0, 0, 0, 0)
  }
})

module.exports = { mongoose, User, Exercise }
