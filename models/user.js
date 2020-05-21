// USER MODEL
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true},
  cover: {type: String, default: 'https://tokystorage.s3.amazonaws.com/images/default-cover.png'},
  avatar: {type: String, default: "https://www.mhcsa.org.au/wp-content/uploads/2016/08/default-non-user-no-photo.jpg"}
});

// authenticate input against database documents
// userSchema.statics.authenticate = function(email, password, callback) {
//   User.findOne({email: email})
//       .exec(function(error, user) {
//         if (error) {
//           return callback(error);
//         } else if (!user) {
//           let err = new Error("User not found");
//           err.status = 401;
//           return callback(err);
//         }
//         bcrypt.compare(password, user.password, function(error, result) {
//           if (result === true) {
//             return callback(null, user);
//           } else {
//             return callback();
//           }
//         })
//       });
// }
//
// // hash password before saving to the user database
// userSchema.pre("save", function(next) {
//   let user = this;
//   bcrypt.hash(user.password, 10, function(err, hash) {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
