const express = require("express");
const router = express.Router();

// load the user controller
const venueController = require("../controllers/venueController.js");

// get all venues
router.get("/", venueController.getAllVenues);

// get all venues by id
router.get("/byid/:id", venueController.getVenueByID);

// get all venues by postcode
router.get("/bypostcode/:venue_postcode", venueController.getVenueByPostcode);

// get all venues by type
router.get("/bytype/:venue_type", venueController.getVenueByType);

// create venues
router.put("/", venueController.addVenue);

// update venues
router.patch("/:id", venueController.updateVenue);

// delete venue by id
router.delete("/:id", venueController.deleteVenue);

module.exports = router;
