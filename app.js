const express = require("express");
const bodyParser = require("body-parser");

const app = express();

require("./models");


// Body parser middleware
app.use(bodyParser.json());
// support parsing of urlencoded bodies (e.g. for forms)
app.use(bodyParser.urlencoded({ extended: true }));

// GET home page
app.get("/", (req, res) => {
  res.send("<H1>Team Name: Cosmos</H1>");
});

// first import the back-end routes
const userRoute = require("./routes/userRoute");

// Link routes
app.use("/routes/user", userRoute);

// start app and listen for incoming requests on port
app.listen(process.env.PORT || 3000, () => {
  console.log("StudySpot app is running!");
});

