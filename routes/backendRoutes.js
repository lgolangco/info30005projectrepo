const express = require("express");
const router = express.Router();

const userCont = require("../controllers/userController.js");
const venueCont = require("../controllers/reviewController.js");
const reviewCont = require("../controllers/reviewController.js");


/* USER ROUTES */

// get all users



// get user by id

// create a user

// update a user by id

// get user by email



/* VENUE ROUTES */

// get all venues

// get all venues by id

// create venues

// delete review by id

// update venues


/* REVIEW ROUTES */

// get all reviews of venues

// get a review by id

// create review

// delete review by id

// update review

// return all reviews about a given venue

// return all reviews left by a given user

module.exports = router;