const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// routes setup
const frontendRoutes = require("./routes/frontendRoutes.js");

app.use(bodyParser.urlencoded({
    extended: true
}));

// TODO

app.get("/", (req, res) => {
    res.send("Team Name: Cosmos");
});


// assign routes
app.use("/user", frontendRoutes);


app.listen(3000, () => {
    console.log("StudySpot listening on port 3000!");
});