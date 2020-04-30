const express = require("express");

// create router
const router = express.Router();

// load/import the user controller
const userController = require("../controllers/userController.js");
const venueController = require("../controllers/venueController.js");
const reviewController = require("../controllers/reviewController.js");

/* USER ROUTES */

// get all users
router.get("/user", userController.getAllUsers);

// get a user by ID
router.get("/user/:id", userController.getUserByID);

// create a user
router.put("/user", userController.addUser);

// update a user
router.patch("/user/:id", userController.updateUser);


/* VENUE ROUTES */

// get all venues
router.get("/venue", venueController.getAllVenues);

// get all venues by id
router.get("/venue/byid/:id", venueController.getVenueByID);

// get all venues by postcode
router.get("/venue/bypostcode/:venue_postcode", venueController.getVenueByPostcode);

// get all venues by type
router.get("/venue/bytype/:venue_type", venueController.getVenueByType);

// create venues
router.put("/venue", venueController.addVenue);

// update venues
router.patch("/venue/:id", venueController.updateVenue);

// delete venue by id
router.delete("/venue/:id", venueController.deleteVenue);




// export the router
module.exports = router;
