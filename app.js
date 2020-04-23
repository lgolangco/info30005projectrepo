const express = require("express");
const bodyParser = require("body-parser");

const app = express();

require("./models");

// use the body-parser middleware, which parses request bodies into req.body
// support parsing of json
app.use(bodyParser.json());
// support parsing of urlencoded bodies (e.g. for forms)
app.use(bodyParser.urlencoded({ extended: true }));

// GET home page
app.get("/", (req, res) => {
  res.send("<H1>Team Name: Cosmos</H1>");
});

// first import the back-end routes
const backendRoutes = require("./routes/backendRoutes");

// backend routes added onto the end of "/"
app.use("/", backendRoutes);

// start app and listen for incoming requests on port
app.listen(process.env.PORT || 3000, () => {
  console.log("StudySpot app is running!");
});

