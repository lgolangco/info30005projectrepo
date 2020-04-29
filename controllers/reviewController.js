const mongoose = require('mongoose');

// import review model
const Review = mongoose.model("review");
//const User = mongoose.model("user");


// function to handle a request to get all reviews
const getAllReviews = async (req, res) => {
    await Review.find({}, function (err, reviews) {
        if (reviews.length) {
            console.log("Getting all reviews");
            return res.send(reviews);
        } else {
            console.log("Failed to getAllReviews");
            res.status(400);
            return res.send("Failed to getAllReviews")
        }
    })
};


// function to modify review by venue and user
const updateReview = async (req, res) => {
    await Review.findOneAndUpdate(
    {venueId: req.params.venueId, userId: req.body.userId},
    {$set: {content: req.body.content, rating: req.body.rating}},
    // {new: true},
    function (err, updatedReview) {
        if (updatedReview) {
            console.log("Successfully updated review for venueId %s", req.params.venueId);
            return res.send(updatedReview);
            // res.redirect('/');
        } else {
            console.log("Failed to updateReview for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to updateReview for venueId " + req.params.venueId);
        }
    })
};


// function to add review
const addReview = async (req, res) => {
    const check = await Review.find({venueId: req.body.venueId, userId: req.body.userId});
    if (check.length) {
        console.log("Review already exists for venueId %s and userId %s", req.body.venueId, req.body.userId, ", try updateReview instead");
        return res.send("Review already exists for for venueId " + req.body.venueId + " and userId " + req.body.userId + ", try updateReview instead");
    } else {
        const review = new Review({
            venueId:req.body.venueId,
            userId:req.body.userId,
            datePosted:new Date(),
            content:req.body.content,
            rating:req.body.rating
        });
        await review.save(function (err, newReview) {
            if (newReview) {
                console.log("Successfully added review");
                return res.send(newReview);
            } else {
                console.log("Failed to addReview for venueId %s and userId %s", req.body.venueId, req.body.userId);
                res.status(400);
                return res.send("Failed to addReview for  for venueId " + req.params.venueId + " and userId " + req.params.userId);
            }
        })
    }
};


// function to get review by venue and user ID
const getReviewByIDs = async (req, res) => {
    await Review.find({venueId: req.params.venueId, userId: req.params.userId}, function(err, review) {
        if (review.length) {
            console.log("Listing reviews with venueId %s and userId %s", req.params.venueId, req.params.userId);
            return res.send(review);
        } else {
            console.log("Failed to getReviewByIDs for venueId %s and userId %s", req.params.venueId, req.params.userId);
            res.status(400);
            return res.send("Failed to getReviewByIDs for venueId " + req.params.venueId + " and userId " + req.params.userId);
        }
    })
};


// function to get reviews by venue ID
const getReviewByVenueID = async (req, res) => {
    await Review.find({venueId: req.params.venueId}, function(err, reviews) {
        if (reviews.length) {
            console.log("Listing reviews with venueId %s", req.params.venueId);
            return res.send(reviews);
        } else {
            console.log("Failed to getReviewByVenueID for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to getReviewByVenueID for venueId " + req.params.venueId);
        }
    })
};


// function to get review by user ID
const getReviewByUserID = async (req, res) => {
    await Review.find({userId: req.params.userId}, function(err, reviews) {
        if (reviews.length) {
            console.log("Listing reviews with userId %s", req.params.userId);
            return res.send(reviews);
        } else {
            console.log("Failed to getReviewByUserID for userId %s", req.params.userId);
            res.status(400);
            return res.send("Failed to getReviewByUserID for userId " + req.params.userId);
        }
    })
};


// function to delete review by venue and user ID
const deleteReview = async (req, res) => {
    const review = await Review.find({venueId: req.params.venueId, userId: req.body.userId});
        await Review.deleteOne(
    {venueId: req.params.venueId, userId: req.body.userId},
    function() {
        if (review.length) {
            // res.send(review);
            console.log("Successfully deleted review with venueId %s and userId %s", req.params.venueId, req.body.userId);
            return res.redirect('/review');
        } else {
            console.log("Failed to deleteReview for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to deleteReview for venueId " + req.params.venueId);
        }
    })
};


// export functions
module.exports = {
    getAllReviews,
    updateReview,
    addReview,
    getReviewByIDs,
    getReviewByVenueID,
    getReviewByUserID,
    deleteReview
};
