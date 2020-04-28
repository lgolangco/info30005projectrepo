const express = require("express");

// create router
const router = express.Router();

// load/import the user controller
const userController = require("../controllers/userController.js");
const venueController = require("../controllers/reviewController.js");
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

// get all venues by id

// create venues

// delete review by id

// update venues


/* REVIEW ROUTES */

// get all reviews
router.get('/reviews', reviewController.getAllReviews);
// update review
router.put('/reviews/venueID/:userID', reviewController.updateReview);
// add review
router.post('/reviews', reviewController.addReview);
// get review by venue and user ID
router.get('/reviews/venueID/:userID', reviewController.getReviewByIDs);
// get all reviews about a given venue by venue ID
router.get('/reviews/:venueID', reviewController.getReviewByVenueID);
// get all reviews about about a given user by user ID
router.get('/reviews/:userID', reviewController.getReviewByUserID);
// delete review by venue and user ID
router.delete('/reviews/venueID/:userID', reviewController.deleteReview);

// // create review
// router.post('/reviews/id/:userId/:leftById', reviewController.create);


// export the router
module.exports = router;

