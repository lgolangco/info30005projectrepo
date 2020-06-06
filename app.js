const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const fileUpload = require('express-fileupload');

const app = express();

require("./models");

// Passport config
require("./config/passport")(passport);

app.use(fileUpload());

// session middleware
app.use(session({
    secret: "studyspot secret",
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// define local variables for logged in user
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    if (req.isAuthenticated()) {
        res.locals.loginId = req.user._id;
        res.locals.loginName = req.user.name;
        res.locals.biography = req.user.biography;
        res.locals.bookmarks = req.user.bookmarks;
    }
    next();
});

// make user ID available in templates
app.use(function (req, res, next) {
    // if user is logged in, res.locals.currentUser will hold their user id, else no session and no session id.
    res.locals.currentUser = req.session.userId;
    next();
});

app.use(cors());


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
app.use(function (req, res, next) {
    let err = new Error("Oops!  We can't seem to find the page you're looking for.");
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("StudySpot app is running!");
});
