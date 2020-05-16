const express = require("express");
var router = express.Router();

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
//
// // GET Venues
// router.get("/venues", (req, res, next) => {
//     return res.render("venues", {title: "Study Areas"});
// });

// GET Register
router.get("/register", mid.loggedOut, function(req, res, next) {
    return res.render("register", {title: "Sign Up"});
});

// GET newvenue
router.get("/newvenue", (req, res, next) => {
  return res.render("newvenue", {title: "Register a New Venue"});
});

// GET venuesuggestions
router.get("/venuesuggestions/:_id",venueController.getVenueSuggestionsByID);

// GET venueUpdate
router.get("/venueUpdate/:_id",venueController.getVenueUpdateByID);

// POST getVenueUpdate
router.post("/venueUpdate/:_id",venueController.updateVenue);

// POST newvenue
router.post("/newvenue", venueController.addVenue);

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

// displays edit form based on user ID
router.get("/profile/edit", userController.updateUserForm);

// update a user
router.post("/profile", userController.updateUser);

// GET Logout
router.get("/logout", userController.logout);


module.exports = router;
