const express = require("express");
var router = express.Router();

const userController = require("../controllers/userController.js");
const mid = require("../middleware");


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
router.get("/register", mid.loggedOut, function(req, res, next) {
    return res.render("register", {title: "Sign Up"});
});

// POST Register
router.post("/register", userController.addUser);

// GET Login
router.get("/login", mid.loggedOut, function(req, res, next) {
    return res.render("login", {title: "Log In"});
});

// POST Login
router.post("/login", userController.login);

// GET Profile
router.get("/profile", mid.requiresLogin, userController.accessProfile);

// GET Logout
router.get("/logout", userController.logout);


module.exports = router;