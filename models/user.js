const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  }

  email: {
    type: String
  }
});

const User = mongoose.model("user", userSchema, "user");

userSchema.plugin(uniqueValidator);
module.exports = User;
