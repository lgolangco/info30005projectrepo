const express = require("express");
var router = express.Router();

// load the user controller
const userController = require("../controllers/userController.js");

// GET home page
router.get("/", (req, res, next) => {
    return res.render("index", {title: "Home"});
});

// GET About page
router.get("about", (req, res, next) => {
    return res.render("about", {title: "About"});
});

// GET Contact page
router.get("/contact", (req, res, next) => {
    return res.render("contact", {title: "Contact"});
});

// GET Register page
router.get("/register", (req, res, next) => {
    return res.render("register", {title: "Sign Up"});
});

// POST Register
router.post("/register", userController.addUser);

module.exports = router;