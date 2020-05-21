const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const {ensureAuthenticated} = require("../config/auth");

const User = require("../models/user");

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");


// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home"});
});

// GET About
router.get("/about", (req, res, next) => {
    return res.render("about", {title: "About"});
});

// USER

// GET Register form page
router.get("/register", function(req, res, next) {
    return res.render("register", {title: "Sign Up"});
});

// POST Register form
router.post("/register", userController.addUser);

// GET Login
router.get("/login", function(req, res, next) {
    return res.render("login", {title: "Log In"});
});

// POST Login
// router.post("/login", userController.login);
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

// GET Profile
// router.get("/profile", userController.accessProfile);
router.get("/profile", ensureAuthenticated, (req, res) => {
    res.render("profile", {
        user: req.user
    })
});

// GET Profile edit form based on user ID
router.get("/profile/edit", userController.updateUserForm);

// GET Profile delete form based on user ID
router.get("/profile/delete", function(req, res) {
    return res.render("userUpdateForm", {toDelete: true})
});

// POST Profile update
router.post("/profile", userController.updateUser);

// POST Profile delete request
router.post("/profile/delete", userController.deleteUserByID);

// GET Logout
// router.get("/logout", userController.logout);
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
});

// VENUE

// GET newVenue form page
router.get("/newvenue", (req, res, next) => {
  return res.render("newvenue", {title: "Register a New Venue"});
});

// POST newVenue form
router.post("/newvenue", venueController.addVenue);

// GET venuesuggestions form page
router.get("/venueSuggestions/:_id",venueController.getVenueSuggestionsByID);

// POST venueSuggestion form
router.post("/venueSuggestions/:_id", venueController.submitVenueSuggestion);

// GET venueUpdate form page
router.get("/venueUpdate/:_id",venueController.getVenueUpdateByID);

// POST getVenueUpdate form
router.post("/venueUpdate/:_id",venueController.updateVenue);

// POST deleteVenue request
router.post("/deleteVenue/:_id",venueController.deleteVenue)


module.exports = router;
