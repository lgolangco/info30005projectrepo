const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,

  first_name: {
    type: String,
    required: true
  },

  last_name: {
    type: String,
    required: true
  }

});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
