// USER MODEL
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true, trim: true},
  last_name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true},
  cover: {type: String, default: 'https://tokystorage.s3.amazonaws.com/images/default-cover.png'},
  avatar: {type: String, default: "https://www.mhcsa.org.au/wp-content/uploads/2016/08/default-non-user-no-photo.jpg"},
  admin: {type: Boolean, default: false}
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
