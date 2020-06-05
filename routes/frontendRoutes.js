const express = require("express");
const router = express.Router();

const {ensureAuthenticated, forwardAuthenticated} = require("../config/auth");

const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const imageController = require("../controllers/imageController.js");


// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home"});
});

// GET About
router.get("/about", (req, res, next) => res.render("about", {title: "About"}));

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
router.get("/profile", ensureAuthenticated, (req, res) => {
    res.render("profile", {user: req.user})
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

// GET venueImage page by venue Id
router.get("/venueImage/:_id", venueController.getVenueImagePage);

const AWS = require('aws-sdk');
router.post('/venueImage/:_id', async (req, res) => {

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
      secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
      region: "us-east-1" //Region
    });

    console.log(s3.config);

    console.log("FILECONTENT");
    // Binary data base64
    const fileContent  = Buffer.from(req.files.venueImage.data, 'binary');
    console.log(fileContent);

    const date = new Date();
    const dateInfo = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
    + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    console.log("DATE");
    console.log(date);
    console.log("DATEINFO");
    console.log(dateInfo);

    console.log("TYPE");
    console.log(req.files.venueImage.mimetype);
    var fileType = "." + (req.files.venueImage.mimetype).slice(6)
    console.log("fileType")
    console.log(fileType)
    // if (req.files.venueImage.mimetype === "image/jpeg") {
    //   console.log("MATCH");
    //   fileType = ".jpg";
    // } else {
    //   fileType = ".png";
    // }

    const imageKey = "venue/fromUsers/" + req.params._id.toString() + "/" + req.user._id.toString() + dateInfo + fileType
    console.log("IMAGEKEY");
    console.log(imageKey)


    // Setting up S3 upload parameters
    const params = {
        Bucket: 'studyspot',
        Key: imageKey, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
    };

    console.log("params set!");
    console.log("trying to upload!");

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
      console.log("STILL trying to upload!");
        if (err) {
            throw err;
        }
        // const venue = await Venue.findById(req.params._id);
        return res.render('venueImage', {
            // venue: venue;
            completed: true
        });
    });

});





module.exports = router;
