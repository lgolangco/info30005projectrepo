const express = require("express");

// create router
const reviewRouter = express.Router();

// load the user controller
const reviewController = require("../controllersController.js");

/* REVIEW ROUTES */

// get all reviews
reviewRouter.get('/', reviewController.getAllReviews);

// update review
reviewRouter.patch('/:venueId', reviewController.updateReview);

// add review
reviewRouter.post('/', reviewController.addReview);

// get review by venue and user ID
reviewRouter.get('/byids/:venueId/:userId', reviewController.getReviewByIDs);

// get all reviews about a given venue by venue ID
reviewRouter.get('/byvenue/:venueId', reviewController.getReviewByVenueID);

// get all reviews about about a given user by user ID
reviewRouter.get('/byuser/:userId', reviewController.getReviewByUserID);

// delete review by venue and user ID
reviewRouter.delete('/:venueId', reviewController.deleteReview);


// export the router
module.exports = reviewRouter;
