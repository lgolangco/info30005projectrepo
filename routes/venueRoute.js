const express = require("express");
const router = express.Router();

// load the user controller
const venueController = require("../controllers/venueController.js");

// GET list of all venues
router.get("/", venueController.getAllVenues);

// GET list of all venues by id
router.get("/:_id", venueController.getVenueByID);

// GET list of all venues by postcode
router.get("/bypostcode/:venuePostcode", venueController.getVenueByPostcode);

// GET list of all venues by type
router.get("/bytype/:venueType", venueController.getVenueByType);

module.exports = router;
