var users = require("../models/user");

// get all users
const getAllUsers = (req, res) => {
    res.send(users);
};


// get user by id
const getUserById = (req, res) => {
    // search for user in the database by ID
    const author = users.find(user => user.id === req.params.id);

    if (user) {
        res.send(user); // send back the author details
    }

    else {
        // you can decide what to return if author is not found
        // currently, an empty list will return
        res.send([]);
    }
};

// create a user
const createUser = (req, res) => {
    // extract info. from body
    const user = req.body;

    users.push(user);
    res.send(users);
};

// update a user by id
const updateUser = (req, res) => {
    const new_user = req.body;

    const user = users.find(user => user.id === req.params.id);
    if (!user) {
        return res.send([]);
    }
    Object.assign(user, new_user);
    res.send(user);
};

// get user by email





module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
};