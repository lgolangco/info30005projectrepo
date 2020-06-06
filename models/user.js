// USER MODEL
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true, trim: true},
  last_name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
  biography: {type: String},
  bookmarks: {type: [mongoose.Types.ObjectId], ref: 'venue'}
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
