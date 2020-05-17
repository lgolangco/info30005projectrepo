const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const mid = require("../middleware");


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
router.get("/register", mid.loggedOut, function(req, res, next) {
    return res.render("register", {title: "Sign Up"});
});

// POST Register form
router.post("/register", userController.addUser);

// GET Login
router.get("/login", mid.loggedOut, function(req, res, next) {
    return res.render("login", {title: "Log In"});
});

// POST Login
router.post("/login", userController.login);

// GET Profile
router.get("/profile", mid.requiresLogin, userController.accessProfile);

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
router.get("/logout", userController.logout);


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
