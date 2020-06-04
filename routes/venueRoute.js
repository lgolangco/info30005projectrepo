const express = require("express");
const router = express.Router();

// load the user controller
const venueController = require("../controllers/venueController.js");

// load the review controller
const reviewController = require("../controllers/reviewController.js");

// GET list of all venues
router.get("/", venueController.getAllVenues);

// GET list of all venues by id
router.get("/:_id", venueController.getVenueByID);

// POST bookmark to user data
router.post("/:_id/bookmark", venueController.bookmark);

// POST to remove bookmark from user data
router.post("/:_id/remove", venueController.removeBookmark);

// GET list of all venues by postcode
router.get("/bypostcode/:venuePostcode", venueController.getVenueByPostcode);

// GET list of all venues by type
router.get("/bytype/:venueType", venueController.getVenueByType);

// POST new review
router.post("/:_id", reviewController.addReview);

module.exports = router;
