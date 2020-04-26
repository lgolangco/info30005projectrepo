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


// export the router
module.exports = router;

