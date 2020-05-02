const express = require("express");
const router = express.Router();

// load the user controller
const userController = require("../controllers/userController.js");

// get all users
router.get("/", userController.getAllUsers);

// get user by ID
router.get("/:_id", userController.getUserByID);

// get user by email
router.get("/email/:email", userController.getUserByEmail);

// create a user
router.put("/", userController.addUser);

// update a user
router.patch("/:_id", userController.updateUser);

// delete by user id
router.delete("/:_id", userController.deleteUserByID);

module.exports = router;