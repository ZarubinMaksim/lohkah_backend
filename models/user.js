const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10,
  },
  department: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  }
});

module.exports = mongoose.model('user', userSchema);