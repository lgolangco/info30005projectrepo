const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  email: String,

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema, "user");
module.exports = User;
