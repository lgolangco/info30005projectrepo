/* Extracted from https://github.com/bradtraversy/node_passport_login */

ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/login");
}

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

