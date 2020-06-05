/* Extracted from https://github.com/bradtraversy/node_passport_login */

// middleware for user authentication

// only authenticated users are allowed to access it
ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/login");
}

// prevents user from accessing web page when user not authenticated, redirects them back to profile page
forwardAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/profile");
}

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
}

