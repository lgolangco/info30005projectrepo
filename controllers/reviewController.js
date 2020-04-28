const mongoose = require("mongoose");

// import review model
const Review = mongoose.model("review");
//const User = mongoose.model("user");


// function to handle a request to get all reviews
var getAllReviews = function(req, res) {
    Review.find(function(err,reviews){
        if(!err){
            res.send(reviews);
        }else{
            res.sendStatus(400);
            res.send("Database query failed");
        }
    });
};


// function to modify review by ID
var updateReview = function(req, res) {
    var venue_id = req.body.venue_id;
    var user_id = req.body.user_id;
    var content = req.body.content;

    Review.findOneAndUpdate(
        {venue_id: venue_id, user_id: user_id},
        {content: content},
        function(err, updatedReview){
            if(!err){
                res.send(updatedReview);
                res.send("Successfully updated review");
            }else{
                res.sendStatus(400);
                res.send("updateReview function failed");
            }
    });
};


// function to add review
var addReview = function(req, res) {
    var review = new Review({
        venue_id:req.body.venue_id,
        user_id:req.body.user_id,
        date_posted:new Date(),
        content:req.body.content,
        rating:req.body.rating
    };

    review.save(function (err,newReview) {
        if (!err) {
            res.send(newReview);
            res.send("Successfully added review");
        } else {
            res.sendStatus(400);
            res.send("addReview function failed");
        }
    });
};


// function to get review by venue and user id
var getReviewByIDs = function(req, res) {
    var venue_id = req.body.venue_id;
    var user_id = req.body.user_id;

    Review.find({venue_id: venue_id, user_id: user_id}, function(err, review) {
        if(!err) {
            res.send(review);
        }else{
            res.sendStatus(404);
            res.send("getReviewByIDs function failed");
        }
    });
};


// function to get review by venue id
var getReviewByVenueID = function(req, res) {
    var venue_id = req.body.venue_id;

    Review.find({venue_id: venue_id}, function(err, review) {
        if(!err) {
            res.send(review);
        }else{
            res.sendStatus(404);
            res.send("getReviewByVenueID function failed");
        }
    });
};


// function to get review by user id
var getReviewByUserID = function(req, res) {
    var user_id = req.body.user_id;

    Review.find({user_id: user_id}, function(err, review) {
        if(!err) {
            res.send(review);
        }else{
            res.sendStatus(404);
            res.send("getReviewByUserID function failed");
        }
    });
};


var deleteReview = function(req, res) {
    var venue_id = req.body.venue_id;
    var user_id = req.body.user_id;

    Review.findOneAndRemove(
        {venue_id: venue_id, user_id: user_id},
        function(err, review){
            if(!err){
                res.send(review);
                res.send("Successfully deleted review");
            }else{
                res.sendStatus(404);
                res.send("deleteReview function failed");
            }
        });
}


// remember to export the functions
module.exports = {
    getAllReviews,
    updateReview,
    addReview,
    getReviewByIDs,
    getReviewByVenueID,
    getReviewByUserID,
    deleteReview
};
