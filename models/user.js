const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  email: String,

  first_name: {
    type: String,
    required: true
  },

  last_name: {
    type: String,
    required: true
  },

});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema, "user");
module.exports = User;
