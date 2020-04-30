const mongoose = require("mongoose");

const User = mongoose.model("user");
const Review = mongoose.model("review");


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
  User.updateMany(
      {id: req.params.id},
      {$set: req.body},
      function(err) {
        if (!err) {
          return res.send("Successfully updated user");
        } else {
          console.log("Failed to get updateUser to work");
          res.status(400);
          return res.send("updateUser function failed");
        }
      }
  )


};


// function to add user
const addUser = async (req, res) => {
  const user = req.body;
  const db = mongoose.connection;
  try {
    db.collection("user").insertOne(user);
    return res.send("Successfully added a user");
  } catch(err) {
    res.status(400);
    return res.send("addUser function failed");
  }
};


// function to get user by id
const getUserByID = async (req, res) => {
  await User.find({id: req.params.id}, function(err, user) {
    if (user) {
      return res.send(user);
    } else {
      res.status(400);
      return res.send("getUserByID function failed");
    }
  })
};

// function to delete User by ID
const deleteUserByID = async(req, res) => {

  // TODO: delete associated reviews made by user
  User.deleteMany( {userId: req.params.id}, function(err) {
    res.status(400);
  });

  await User.deleteMany( {id: req.params.id}, function(err) {
    try {
      return res.send("Successfully deleted the specified user");
    } catch (err) {
      res.sendStatus(400);
      return res.send("deleteUserByID function failed");
    }
  })

};



// remember to export the functions
module.exports = {
  getAllUsers,
  getUserByID,
  addUser,
  updateUser,
  deleteUserByID
};
