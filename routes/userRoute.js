const express = require("express");

// create router
const userRouter = express.Router();

// load/import the user controller
const userController = require("../controllers/userController.js");

// handle the GET request on root of the user-management path
// i.e. get all users
userRouter.get("/", userController.getAllUsers);

// handle the GET request to get an user by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
userRouter.get("/:id", userController.getUserByID);

// handle the POST request to add an user
userRouter.post("/", userController.addUser);

// handle the POST request to update an user
// note that the PATCH method may be more appropriate
userRouter.post("/:id", userController.updateUser);

// export the router
module.exports = userRouter;
