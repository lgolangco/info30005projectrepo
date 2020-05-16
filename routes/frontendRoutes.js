const express = require("express");
var router = express.Router();

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const mid = require("../middleware");

//REMOVE LATER
const mongoose = require("mongoose");
const Venue = mongoose.model("venue");
//REMOVE LATER

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


// GET venuesugegstions
router.get("/venuesuggestions/:_id", async (req, res, next) => {
  await Venue.find({_id: req.params._id}, function(err, venue) {
    // checks if the _id is invalid or there are no venues listed with that _id
    if (venue.length === 0) {
      return res.send("There are no venues listed with this id");

    } else if (venue) {
      return res.render('venueSuggestions', {
        venue: venue[0]
      });
    } else {
      res.status(400);
      return res.send("getVenueByID function failed");
    }
  })
});


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
