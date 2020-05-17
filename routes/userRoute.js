const express = require("express");
const router = express.Router();

// load the user controller
const userController = require("../controllers/userController.js");

// GET list of all users
router.get("/", userController.getAllUsers);

// GET user by ID
router.get("/:_id", userController.getUserByID);

// GET user by email
router.get("/email/:email", userController.getUserByEmail);

// // displays edit form based on user ID in the url
// router.get("/:_id/edit", userController.updateUserForm);
//
// // update a user
// router.post("/:_id", userController.updateUser);

// // delete by user id
// router.delete("/:_id", userController.deleteUserByID);

module.exports = router;
