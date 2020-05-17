const express = require("express");

// create router
const reviewRouter = express.Router();

// load the review controller
const reviewController = require("../controllers/reviewController.js");

/* REVIEW ROUTES */

// GET list of all reviews
reviewRouter.get('/', reviewController.getAllReviews);

// PATCH update review
reviewRouter.patch('/:venueId', reviewController.updateReview);

// POST review
reviewRouter.post('/', reviewController.addReview);

// GET review by venue and user ID
reviewRouter.get('/byids/:venueId/:userId', reviewController.getReviewByIDs);

// GET all reviews about a given venue by venue ID
reviewRouter.get('/byvenue/:venueId', reviewController.getReviewByVenueID);

// GET all reviews about about a given user by user ID
reviewRouter.get('/byuser/:userId', reviewController.getReviewByUserID);

// DELETE review by venue and user ID
reviewRouter.delete('/:venueId', reviewController.deleteReview);


// export the router
module.exports = reviewRouter;
