const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

require("./models");

app.use(cors());

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + "/public"));

// view engine setup
app.set("view engine", "pug");
app.set("views", __dirname + "/views");


// setting up routes
const frontendRoutes = require("./routes/frontendRoutes");
const userRoute = require("./routes/userRoute");
const venueRoute = require("./routes/venueRoute");
const reviewRouter = require("./routes/reviewRoute");

// assign routes
app.use("/", frontendRoutes);
app.use("/user", userRoute);
app.use("/venue", venueRoute);
app.use("/review", reviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("File not found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error:{}
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("StudySpot app is running!");
});
