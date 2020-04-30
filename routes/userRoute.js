const express = require("express");
const router = express.Router();

// load/import the user controller
const userController = require("../controllers/userController.js");

// get all users
router.get("/", userController.getAllUsers);

// get a user by ID
router.get("/:id", userController.getUserByID);

// create a user
router.put("/", userController.addUser);

// update a user
router.patch("/:id", userController.updateUser);

// delete by user id
router.delete("/:id", userController.deleteUserByID);

module.exports = router;