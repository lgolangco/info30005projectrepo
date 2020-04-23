const mongoose = require("mongoose");

// import user model
const User = mongoose.model("user");

    
// function to handle a request to get all users
const getAllUsers = async (req, res) => {
  try {
    const all_users = await User.find();
    return res.send(all_users);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// function to modify user by ID
const updateUser = async (req, res) => {
  await User.update(
      {id: req.params.id},
      {id: req.body.id, first_name: req.body.first_name, last_name: req.body.last_name},
      {overwrite: true},
      function(err) {
        if (!err) {
          return res.send("Successfully updated selected user");
        } else {
          res.status(400);
          return res.send("updateUser function failed");
        }
      }
  )
};


// function to add user
const addUser = async (req, res) => {
 res.send("adding User");
};


// function to get user by id
const getUserByID = async (req, res) => {
  User.find({id: req.params.id}, function(err, user) {
    if (user) {
      res.send(user);
    } else {
      res.status(400);
      res.send("getUserByID function doesn't work");
    }
  })
};

// remember to export the functions
module.exports = {
  getAllUsers,
  getUserByID,
  addUser,
  updateUser
};
