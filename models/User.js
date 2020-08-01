const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'You got to have a name dude!!!'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
