// USER MODEL
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String
  }

});


const User = mongoose.model("user", userSchema, "user");
module.exports = User;
