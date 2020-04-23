const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  first_name: String,
  last_name: String
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
