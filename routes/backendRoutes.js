const express = require("express");

// create router
const router = express.Router();


const venueController = require("../controllers/venueController.js");
const reviewController = require("../controllers/reviewController.js");




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


/* REVIEW ROUTES */

// get all reviews
router.get('/review', reviewController.getAllReviews);

// update review
router.patch('/review/:venueId', reviewController.updateReview);

// add review
router.post('/review', reviewController.addReview);

// get review by venue and user ID
router.get('/review/byids/:venueId/:userId', reviewController.getReviewByIDs);

// get all reviews about a given venue by venue ID
router.get('/review/byvenue/:venueId', reviewController.getReviewByVenueID);

// get all reviews about about a given user by user ID
router.get('/review/byuser/:userId', reviewController.getReviewByUserID);

// delete review by venue and user ID
router.delete('/review/:venueId', reviewController.deleteReview);

// // create review
// router.post('/reviews/id/:userId/:leftById', reviewController.create);


// export the router
module.exports = router;
