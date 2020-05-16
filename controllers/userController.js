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
        const users = await User.find({_id: req.session.userId});

        if (!users) {
            res.status(400);
            console.log("User not found");
            return res.send("User not found");
        }
        const user = users[0];
        console.log("Updating user:", user);
        res.render('userUpdateForm', {
            user: user,
            toDelete: false
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
    if (ObjectId.isValid(req.session.userId) === false) {
        return res.send("There are no users listed with this id");
    }

    // checks if there are no venues listed with that _id
    const users = await User.find({_id: req.session.userId});
    if (users.length === 0) {
        res.status(400);
        console.log("User not found");
        return res.send("There are no users listed with this id");
    }

    try {
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
            const user = users[0]

            // update the venue with the following _id
            user["name"] = req.body.name;
            user["email"] = req.body.email;
            user["password"] = req.body.password;
            user["cover"] = req.body.cover;
            user["avatar"] = req.body.avatar;

            await user.save();
            return res.redirect("/profile");

        } else {
            var err = new Error("All fields required");
            err.status = 400;
            return next(err);
        }
    } catch (err) {
        res.status(400);
        console.log(err);
        return res.send("Edit user failed");
    }
};


// function to add user

const addUser = async(req, res, next) => {

    const {name, email, password, confirmPassword} = req.body;

    let errors = [];
    if (!name || !email || !confirmPassword) {
        errors.push({msg: "Please fill in all the fields"});
        var err = new Error("Please fill in all the fields");
        err.status = 400;
        return next(err);
    }

    if (password !== confirmPassword) {
        errors.push({msg: "Passwords do not match"});
        var err = new Error("Passwords do not match");
        err.status = 400;
        return next(err);
    }

    if (password.length < 8) {
        errors.push({msg: "Password must be at least 8 characters"});
        var err = new Error("Password must be at least 8 characters");
        err.status = 400;
        return next(err);
    }

    if (errors.length > 0) {
        res.render("register", {
            errors, name, email, password, confirmPassword
        });
    } else {
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    errors.push({msg: "Email is already registered"});
                    var err = new Error("Email is already registered");
                    err.status = 400;
                    return next(err);
                } else {
                    const userData = new User( {
                        name: name,
                        email: email,
                        password: password
                    })

                    User.create(userData, function(error, user) {

                        if (error) {
                            console.log("failed to create user");
                            return next(error);
                        } else {
                            console.log("Created user");
                            return res.redirect("/login");
                        }
                    });
                }
            })
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
    if (ObjectId.isValid(req.session.userId) === false) {
        return res.send("There are no users listed with this id");
    }

    // deletes the reviews associated with the user
    Review.deleteMany({userId: req.session.userId}, function (err) {
        res.status(400);
    });

    // deletes the user with the following _id
    await User.deleteOne({_id: req.session.userId}, function (err) {
        try {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect("/");
                }
            })
        } catch (err) {
            res.sendStatus(400);
            return res.send("deleteUserByID function failed");
        }
    })
};

const login = async (req, res,next) => {
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
                return res.render("profile", {title: "Profile", user: user});
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
    updateUserForm,
    updateUser,
    deleteUserByID,
    getUserByEmail,
    login,
    accessProfile,
    logout
};
