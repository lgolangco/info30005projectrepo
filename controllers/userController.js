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
  res.send("Working on this feature");
};

// function to add user
const addUser = async (req, res) => {
 res.send("Working on this feature");
};

// function to get user by id
const getAllUserID = (req, res) => {
  res.send("Working on this feature");
};

// remember to export the functions
module.exports = {
  getAllUsers,
  getAllUserID,
  addUser,
  updateUser
};
