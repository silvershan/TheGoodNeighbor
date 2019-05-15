const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  //reference to the user model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  bootcamp: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('profile', ProfileSchema);
