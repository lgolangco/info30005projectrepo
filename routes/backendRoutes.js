const express = require("express");

// create router
const router = express.Router();


const reviewController = require("../controllers/reviewController.js");


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
