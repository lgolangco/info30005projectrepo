// USER MODEL
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: trues
  }

});


const User = mongoose.model("user", userSchema, "user");
module.exports = User;
