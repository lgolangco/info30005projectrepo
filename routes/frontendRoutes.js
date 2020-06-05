const express = require("express");
const router = express.Router();

const {ensureAuthenticated, forwardAuthenticated} = require("../config/auth");

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const adminController = require("../controllers/adminController.js");


// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home"});
});

// GET About
router.get("/about", (req, res, next) => res.render("about", {title: "About"}));


// ADMIN

// GET Admin page
router.get("/admin", adminController.getAdminPage);

// GET Admin Delete Request Page
router.get("/admin/deleteRequest/:_id", adminController.getDeleteRequestPage);

// POST Admin Delete Request
router.post("/admin/deleteRequest/:_id", adminController.postDeleteRequest);

// GET Admin Resolve Request page
router.get("/admin/resolveRequest/:_id", adminController.getResolveRequestPage);

// POST Admin Resolve Request form
router.post("/admin/resolveRequest/:_id", adminController.postResolveRequest);

// GET Admin Delete Suggestion page
router.get("/admin/deleteSuggestion/:_id", adminController.getDeleteSuggestionPage);

// POST Admin Delete Suggestion
router.post("/admin/deleteSuggestion/:_id", adminController.postDeleteSuggestionPage);

// GET Admin Resolve Suggestion page
router.get("/admin/resolveSuggestion/:_id", adminController.getResolveSuggestionPage);

// POST Admin Resolve Suggestion form
router.post("/admin/resolveSuggestion/:_id", adminController.postResolveSuggestionPage);



// USER
// GET Register form page
router.get("/register", forwardAuthenticated, (req, res, next) => res.render("register", {title: "Sign Up"}));

// POST Register form
router.post("/register", userController.addUser);

// GET Login
router.get("/login", forwardAuthenticated, (req, res, next) => res.render("login", {title: "Log In"}));

// POST Login
router.post("/login", userController.login);

// GET Profile
router.get("/profile", ensureAuthenticated, userController.loadProfile);

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

// GET deleteVenue confirmation page
router.get("/deleteVenue/:_id",venueController.getDeleteVenueConfirmationPage);

// POST deleteVenue request
router.post("/deleteVenue/:_id",venueController.deleteVenue);

// GET requestNew venue page
router.get("/requestNew/", venueController.getRequestNew);

// POST requestNew venue
router.post("/requestNew/", venueController.addRequestNew);

module.exports = router;
