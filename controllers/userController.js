/* Extracted from https://github.com/bradtraversy/node_passport_login */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");

// import user and review model
const User = mongoose.model("user");
const Review = mongoose.model("review");
const Venue = mongoose.model("venue");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;

// function to view all users
const getAllUsers = async (req, res) => {
    users = [];
    try {
        const all_users = await User.find();
        if (all_users.length === 0) {
            return res.render('usererror', {message: "There are no existing users yet"});
        } else {
            return res.render('users', {users: all_users});
        }
    } catch (err) {
        res.status(400);
        return res.render('usererror', {message: "Database query failed"});
    }
}

const loadProfile = async(req, res) => {
    try {
        const bookmarks = await Venue.find({_id: { $in :req.user.bookmarks}});
        console.log(req.user.bookmarks);
        return res.render("profile", {user: req.user, bookmarks: bookmarks, title: "Profile"});
    } catch (err) {
        res.status(400);
        console.log(req.user.bookmarks,err);
        return res.render("profile", {user: req.user, bookmarks: "none"});
    }
}


// function to render update user by id form
const updateUserForm = async (req, res) => {

    try {
        const users = await User.find({_id: req.user._id});

        if (!users) {
            res.status(400);
            console.log("User not found");
            return res.render('usererror', {message: "User not found"});
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
        return res.render('usererror', {message: "Edit user failed"});
    }
}


// function to modify user details
const updateUser = async (req, res, next) => {
    // checks if the _id is invalid
    if (ObjectId.isValid(req.user._id) === false) {
        return res.render('usererror', {message: "There are no users listed with this id"});
    }

    // checks if there are no venues listed with that _id
    const users = await User.find({_id: req.user._id});
    if (users.length === 0) {
        res.status(400);
        console.log("User not found");
        return res.render('usererror', {message: "There are no users listed with this id"});
    }

    try {
        if (req.body.email &&
            req.body.first_name &&
            req.body.password &&
            req.body.last_name) {


            const user = users[0]

            if(user["password"] !== req.body.password) {
                // Hash Password
                bcrypt.genSalt(10, (err, salt) =>
                     bcrypt.hash(req.body.password, salt, async (err, hash) => {
                        if (err) throw err;
                        // set password to hash
                        const users2 = await User.find({_id: req.user._id});
                        const user2 = users2[0];
                        user2.password = hash;
                        user2.save()
                            .catch(err => console.log(err));
                    }));
            }

            // update the venue with the following _id
            user["first_name"] = req.body.first_name;
            user["last_name"] = req.body.last_name;
            user["email"] = req.body.email;
            user["cover"] = req.body.cover;
            user["avatar"] = req.body.avatar;
            user["biography"] = req.body.biography;

            // save
            user.save()
                .then(user => {
                    return res.redirect("/profile");
                })
                .catch(err => console.log(err));



        } else {
            let err = new Error("All fields required");
            err.status = 400;
            return next(err);
        }
    } catch (err) {
        res.status(400);
        console.log(err);
        return res.render('usererror', {message: "Edit user failed"});
    }
};


// function to add user
const addUser = async (req, res, next) => {

    const {first_name, last_name, email, password, biography} = req.body;

    let errors = [];
    if (!first_name || !last_name || !email) {
        errors.push({msg: "Please fill in all the fields required"});
    }

    if (password.length < 8) {
        errors.push({msg: "Password must be at least 8 characters"});
    }

    if (errors.length > 0) {
        res.render("register", {
            errors, first_name, last_name, email, password, biography
        });
    } else {
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    errors.push({msg: "Email is already registered"});
                    res.render("register", {
                        errors, first_name, last_name, email, password, biography
                    })

                } else {
                    const userData = new User({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: password,
                        biography: biography
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(userData.password, salt, (err, hash) => {
                            if (err) throw err;
                            // set password to hash
                            userData.password = hash;
                            // save
                            userData.save()
                                .then(user => {
                                    req.flash("success_msg", "You are now registered and can log in");
                                    res.redirect("/login");
                                })
                                .catch(err => console.log(err));
                        }))
                }
            })
    }
};


// function to get user by id
const getUserByID = async (req, res) => {
    // checks if the _id is invalid
    if (ObjectId.isValid(req.params._id) === false) {
        return res.render('usererror', {message: "There are no users listed with this id"});
    }

    await User.find({_id: req.params._id}, function (err, user) {
        if (user.length === 0) {
            return res.render('usererror', {message: "There are no users listed with this id"});
        } else if (user) {
            return res.render('userProfile', {user: user[0]});
        } else {
            res.status(400);
            return res.render('usererror', {message: "getUserByID function failed"});
        }
    })
};


// function to get user by email
const getUserByEmail = async (req, res) => {
    await User.find({email: req.params.email}, function (req, user) {
        try {
            return res.redirect("/user/" + user[0]._id);
        } catch (err) {
            res.status(400);
            return res.render('usererror', {message: "getUserByEmail function failed"});
        }
    })
}


// function to delete User
const deleteUserByID = async (req, res) => {

    // checks if the _id is invalid
    if (ObjectId.isValid(req.user._id) === false) {
        return res.render('usererror', {message: "There are no users listed with this id"});
    }

    // deletes the reviews associated with the user
    Review.deleteMany({userId: req.user._id}, function (err) {
        res.status(400);
    });

    // deletes the user with the following _id
    await User.deleteOne({_id: req.user._id}, function (err) {
        try {
            req.session.destroy(function (err) {
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

const logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
}

const login = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
}


module.exports = {
    loadProfile,
    getAllUsers,
    getUserByID,
    addUser,
    updateUserForm,
    updateUser,
    deleteUserByID,
    getUserByEmail,
    logout,
    login
};
