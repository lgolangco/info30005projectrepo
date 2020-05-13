const express = require("express");
var router = express.Router();

// load the user controller
const userController = require("../controllers/userController.js");
const User = require("../models/user");


// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home"});
});

// GET About
router.get("/about", (req, res, next) => {
    return res.render("about", {title: "About"});
});

// GET Contact
router.get("/contact", (req, res, next) => {
    return res.render("contact", {title: "Contact"});
});

// GET Register
router.get("/register", (req, res, next) => {
    return res.render("register", {title: "Sign Up"});
});

// POST Register
router.post("/register", userController.addUser);

// GET Login
router.get("/login", function(req, res, next) {
    return res.render("login", {title: "Log In"});
});

// POST Login
router.post("/login", function(req, res, next) {
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
})

// GET Profile
router.get("/profile", function(req, res, next) {
    if (! req.session.userId) {
        var err = new Error("You are not authorised to view this page.");
        err.status = 403;
        return next(err);
    }
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                return res.render("profile", {title: "Profile", name: user.name});
            }
        });
});


module.exports = router;