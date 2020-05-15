const express = require("express");
const router = express.Router();

// load the user controller
const venueController = require("../controllers/venueController.js");

// get all venues
router.get("/", venueController.getAllVenues);

// get all venues by id
router.get("/:_id", venueController.getVenueByID);

// get all venues by postcode
router.get("/bypostcode/:venuePostcode", venueController.getVenueByPostcode);

// get all venues by type
router.get("/bytype/:venueType", venueController.getVenueByType);

// create venues
router.post("/new", venueController.addVenue);

// update venues
router.patch("/byid/:_id", venueController.updateVenue);

// delete venue by id
router.delete("/byid/:_id", venueController.deleteVenue);

module.exports = router;
