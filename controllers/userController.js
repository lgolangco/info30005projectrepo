const mongoose = require("mongoose");

// import user and review model
const User = mongoose.model("user");
const Review = mongoose.model("review");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;


const getAllUsers = async (req, res) => {
    users = [];
    try {
        const all_users = await User.find();
        if (all_users.length === 0) {
            return res.send("There are no existing users yet");
        } else {
            return res.render('users', {users: all_users});
        }
    } catch (err) {
        res.status(400);
        res.send("Database query failed");
    }
}


// function to render update user by id form
const updateUserForm = async (req, res) => {

    try {
        const users = await User.find({_id: req.params._id});
        if (!users) {
            res.status(400);
            console.log("User not found");
            return res.send("User not found");
        }

        const user = users[0];
        console.log("Updating user:", user);

        res.render('userUpdateForm', {
            id: user.id,
            username: user.name,
            email: user.email,
            password: user.password
        });
    } catch (err) {
        res.status(400);
        console.log(err);
        return res.send("Edit user failed");
    }
}


// function to modify user by ID
const updateUser = async (req, res,next) => {
    // checks if the _id is invalid
    if (ObjectId.isValid(req.params._id) === false) {
        return res.send("There are no users listed with this id");
    }

    // checks if there are no venues listed with that _id
    await User.find({_id: req.params._id}, function (err, user) {
        if (user.length === 0) {
            return res.send("There are no venues listed with this id");
        }
    });

    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword) {

        // confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
            var err = new Error("Passwords do not match");
            err.status = 400;
            return next(err);
        }

        // update the venue with the following _id
        await User.findOneAndUpdate(
            {_id: req.params._id},
            {$set: req.body},
            function (err, user) {
                if (!err) {
                    return res.redirect("/user/" + user._id);
                } else {
                    res.status(400);
                    return res.send("updateUser function failed");
                }
            }
        )
    } else {
        var err = new Error("All fields required");
        err.status = 400;
        return next(err);
    }
};


// function to add user
const addUser = async (req, res, next) => {
    // const user = req.body;
    // const db = mongoose.connection;
    // try {
    //     db.collection("user").insertOne(user);
    //     return res.send("Successfully added a user");
    // } catch (err) {
    //     res.status(400);
    //     return res.send("addUser function failed");
    // }
    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword) {

        // confirm that user typed same password twice
        if (req.body.password != req.body.confirmPassword) {
            var err = new Error("Passwords do not match");
            err.status = 400;
            return next(err);
        }

        // create object with form input
        var userData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        };

        User.create(userData, function(error, user) {
            if (error) {
                console.log("failed to create user");
                return next(error);
            } else {
                console.log("Created user");
                return res.redirect("/user/" + user._id);
            }
        });

    } else {
        var err = new Error("All fields required");
        err.status = 400;
        return next(err);
    }
};


// function to get user by id
const getUserByID = async (req, res) => {
    // checks if the _id is invalid
    if (ObjectId.isValid(req.params._id) === false) {
        return res.send("There are no users listed with this id");
    }

    await User.find({_id: req.params._id}, function (err, user) {
        if (user.length === 0) {
            return res.send("There are no users listed with this id");
        } else if (user) {
            return res.render('userProfile', {user: user[0]});
        } else {
            res.status(400);
            return res.send("getUserByID function failed");
        }
    })
};


// function to get user by email
const getUserByEmail = async (req, res) => {
    await User.find({email: req.params.email}, function (req, user) {
        try {
            return res.redirect("/user/" + user._id);
        } catch (err) {
            res.status(400);
            res.send("getUserByEmail function failed");
        }
    })
}


// function to delete User by ID
const deleteUserByID = async (req, res) => {

    // checks if the _id is invalid
    if (ObjectId.isValid(req.params._id) === false) {
        return res.send("There are no users listed with this id");
    }

    // deletes the reviews associated with the user
    Review.deleteMany({userId: req.params._id}, function (err) {
        res.status(400);
    });

    // deletes the user with the following _id
    await User.deleteOne({_id: req.params._id}, function (err) {
        try {
            return res.redirect("/user");
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
    updateUserForm,
    updateUser,
    deleteUserByID,
    getUserByEmail
};
