const express = require("express");

const router = express.Router();

const userContent = require("../controllers/userController.js");

// home page
router.get("/", userContent.getAllUsers);

// sign-up page


// login page

// logout page

// user profile


// venue profile



module.exports = router;

