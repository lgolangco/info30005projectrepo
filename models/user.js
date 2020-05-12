// USER MODEL
const mongoose = require("mongoose");
const bcrypt =  require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true}
});

// hash password before saving to the user database
userSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
