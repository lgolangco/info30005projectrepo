const mongoose = require("mongoose");

// import user and review model
const User = mongoose.model("user");
const Review = mongoose.model("review");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;


const getAllUsers = async (req, res) => {
    try {
        const all_users = await User.find();
        if (all_users.length === 0) {
            return res.send("There are no existing users yet");
        } else {
            return res.send(all_users);
        }
    } catch (err) {
        res.status(400);
        res.send("Database query failed");
    }
}


// function to modify user by ID
const updateUser = async (req, res) => {
    // checks if the _id is invalid
    if (ObjectId.isValid(req.params._id) === false) {
        return res.send("There are no users listed with this id");
    }

    // checks if there are no venues listed with that _id
    await User.find({_id: req.params._id}, function (err, user) {
        if (user.length === 0) {
            return res.send("There are no venues listed with this id");
        }
    })

    // update the venue with the following _id
    await User.findOneAndUpdate(
        {_id: req.params._id},
        {$set: req.body},
        function (err) {
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
const addUser = async (req, res, next) => {
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
                return res.redirect("/profile");
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
            return res.send(user);
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
            res.send(user);
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
            res.send("Successfully deleted specified user");
        } catch (err) {
            res.sendStatus(400);
            return res.send("deleteUserByID function failed");
        }
    })
};

const login = async (req, res) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function(error, user) {
            if (error || !user) {
                var err = new Error("Wrong email or password");
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect("/profile");
            }
        });
    } else {
        var err = new Error("Email and password are required");
        err.status = 401;
        return next(err);
    }
}

const accessProfile = async (req, res, next) => {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                return res.render("profile", {title: "Profile", name: user.name});
            }
        });
}

const logout = async (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect("/");
            }
        });
    }
}


module.exports = {
    getAllUsers,
    getUserByID,
    addUser,
    updateUser,
    deleteUserByID,
    getUserByEmail,
    login,
    accessProfile,
    logout
};
