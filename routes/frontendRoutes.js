const express = require("express");
const router = express.Router();

const {ensureAuthenticated, forwardAuthenticated, forwardAuthenticatedAdmin} = require("../config/auth");

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const adminController = require("../controllers/adminController.js");
const imageController = require("../controllers/imageController.js");


// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home", user: req.user});
});

// GET About
router.get("/about", (req, res, next) => res.render("about", {title: "About"}));


// ADMIN

// GET Admin page
router.get("/admin", [ensureAuthenticated, forwardAuthenticatedAdmin], adminController.getAdminPage);

// GET Admin Delete Request Page
router.get("/admin/deleteRequest/:_id",forwardAuthenticatedAdmin, adminController.getDeleteRequestPage);

// POST Admin Delete Request
router.post("/admin/deleteRequest/:_id", adminController.postDeleteRequest);

// GET Admin Resolve Request page
router.get("/admin/resolveRequest/:_id",forwardAuthenticatedAdmin, adminController.getResolveRequestPage);

// POST Admin Resolve Request form
router.post("/admin/resolveRequest/:_id", adminController.postResolveRequest);

// GET Admin Delete Suggestion page
router.get("/admin/deleteSuggestion/:_id",forwardAuthenticatedAdmin, adminController.getDeleteSuggestionPage);

// POST Admin Delete Suggestion
router.post("/admin/deleteSuggestion/:_id", adminController.postDeleteSuggestionPage);

// GET Admin Resolve Suggestion page
router.get("/admin/resolveSuggestion/:_id",forwardAuthenticatedAdmin, adminController.getResolveSuggestionPage);

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


// IMAGES

// GET venueImage page by venue Id
router.get("/venueImage/upload/:_id", imageController.getVenueImagePage);

// POST venueImage photo by venue Id
router.post('/venueImage/upload/:_id', imageController.uploadVenueImage);

// GET userVenueGallery page by venye Id
router.get("/venueGallery/:_id", imageController.getVenueGalleryPage);

// POST deleteVenueImage request by Venue Id
router.post("/venueGallery/:_id", imageController.deleteVenueImage);

// GET venueHeader page by venue Id
router.get("/venueHeader/upload/:_id", imageController.getVenueHeaderPage);

// POST venueHeader image by venue Id
router.post("/venueHeader/upload/:_id", imageController.uploadVenueHeaderImage);

// GET deleteVenueHeader page by venue Id
router.get("/venueHeader/delete/:_id", imageController.getDeleteVenueHeaderPage);

// Post deleteVenueHeader request by venue Id
router.post("/venueHeader/delete/:_id", imageController.deleteVenueHeader);

// GET userAvatarImage page by user Id
router.get("/profile/uploadAvatar/:_id", imageController.getUserAvatarImagePage);

// POST userAvatarImage by user Id
router.post("/profile/uploadAvatar/:_id", imageController.uploadUserAvatarImage);

// GET delete userAvatarImage page by user Id
router.get("/profile/deleteAvatar/:_id", imageController.getdeleteUserAvatarImagePage);

// GET delete userAvatarImage page by user Id
router.post("/profile/deleteAvatar/:_id", imageController.deleteUserAvatar);


module.exports = router;
