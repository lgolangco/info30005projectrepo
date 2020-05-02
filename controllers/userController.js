const mongoose = require("mongoose");

// import user and review model
const User = mongoose.model("user");
const Review = mongoose.model("review");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;


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
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.send("There are no users listed with this id");
  }

  // checks if there are no venues listed with that _id
  await User.find({_id: req.params._id}, function(err, user) {
    if (user.length === 0) {
      return res.send("There are no venues listed with this id");
    }
  })

  // update the venue with the following _id
  await User.findOneAndUpdate(
      {_id: req.params._id},
      {$set: req.body},
      function(err) {
        if (!err) {
          return res.send(req.body);
        } else {
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
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.send("There are no users listed with this id");
  }

  await User.find({_id: req.params._id}, function(err, user) {
    if (user.length === 0) {
      return res.send("There are no users listed with this id");
    } else if (user) {
      return res.send(user);
    } else {
      res.status(400);
      return res.send("getUserByID function failed");
    }
  })
};


// function to get user by email
const getUserByEmail = async(req,res) => {
  await User.find({email: req.params.email}, function(req, user) {
    try {
      res.send(user);
    } catch (err) {
      res.status(400);
      res.send("getUserByEmail function failed");
    }
  })
}


// function to delete User by ID
const deleteUserByID = async(req, res) => {

  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.send("There are no users listed with this id");
  }

  // deletes the reviews associated with the user
  Review.deleteMany( {userId: req.params._id}, function(err) {
    res.status(400);
  });

  // deletes the user with the following _id
  await User.deleteOne( {_id: req.params._id}, function(err) {
    try {
      res.send("Successfully deleted specified user");
    } catch (err) {
      res.sendStatus(400);
      return res.send("deleteUserByID function failed");
    }
  })
};


module.exports = {
  getAllUsers,
  getUserByID,
  addUser,
  updateUser,
  deleteUserByID,
  getUserByEmail
};
