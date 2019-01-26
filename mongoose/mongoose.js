require('dotenv').config()
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

// Instance method to avoid allowing sensitive info to be sent to client
UserSchema.methods.toJSON = function () {
  let user = this.toObject()
  let { _id, username } = user

  return { _id, username }
}

var User = mongoose.model('User', UserSchema)

var Exercise = new mongoose.model('Exercise', {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: 'Cardio'
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = { mongoose, User, Exercise }