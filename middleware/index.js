
function loggedOut(req, res, next) {
    // user is logged into the site, and redirected to profile page
    if (req.session && req.session.userId) {
        return res.redirect("/profile");
    }
    return next();
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

module.exports = {
    loggedOut,
    requiresLogin
};