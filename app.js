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

// setting up routes
const userRoute = require("./routes/userRoute");
// setting up routes
const venueRoute = require("./routes/venueRoute");
// setting up review routes
const reviewRouter = require("./routes/reviewRoute");

// assign routes
app.use("/user", userRoute);
app.use("/routes/venue", venueRoute);
app.use("/review", reviewRouter);
>>>>>>> Stashed changes

// backend routes added onto the end of "/"
app.use("/", backendRoutes);

// start app and listen for incoming requests on port
app.listen(process.env.PORT || 3000, () => {
  console.log("StudySpot app is running!");
});

