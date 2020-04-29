const mongoose = require('mongoose');

// import review model
const Review = mongoose.model("review");
//const User = mongoose.model("user");


// function to handle a request to get all reviews
const getAllReviews = async (req, res) => {
        try {
            const all_reviews = await Review.find();
            return res.send(all_reviews);
        } catch (err) {
            res.status(400);
            return res.send("Database query failed");
        }
    };


// function to modify review by venue and user
const updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findOneAndUpdate(
            {venueId: req.params.venueId, userId: req.body.userId},
            {$set: {content: req.body.content, rating: req.body.rating}},
            {new: true}
            );
        res.send(updatedReview);
        return res.send("Successfully updated review");
        // res.redirect('/');
    } catch (err) {
        res.status(400);
        return res.send("updateReview function failed");
    }
};


// function to add review
const addReview = async (req, res) => {
    const review = new Review({
        venueId:req.body.venueId,
        userId:req.body.userId,
        datePosted:new Date(),
        content:req.body.content,
        rating:req.body.rating
    });

    try {
        const newReview = await review.save();
        res.send(newReview);
        return res.send("Successfully added review");
        // res.redirect('/');
    } catch (err) {
        res.status(400);
        res.send("addReview function failed");
    }
};


// function to get review by venue and user ID
const getReviewByIDs = async (req, res) => {
    try {
        const review = await Review.find({venueId: req.params.venueId, userId: req.body.userId});
        return res.send(review);
    } catch (err) {
        res.status(404);
        res.send("getReviewByIDs function failed");
    }
};


// function to get review by venue ID
const getReviewByVenueID = async (req, res) => {
    try {
        const reviews = await Review.find({venueId: req.params.venueId});
        return res.send(reviews);
    } catch (err) {
        res.status(404);
        res.send("getReviewByVenueID function failed");
    }
};


// function to get review by user ID
const getReviewByUserID = async (req, res) => {
    try {
        const reviews = await Review.find({userId: req.params.userId});
        return res.send(reviews);
    } catch (err) {
        res.status(404);
        res.send("getReviewByUserID function failed");
    }
};


const deleteReview = async (req, res) => {
    try {
        const review = await Review.deleteOne({venueId: req.params.venueId, userId: req.body.userId});
        res.send(review);
        res.send("Successfully deleted review");
        return res.redirect('/');
    } catch (err) {
        res.status(404);
        return res.send("deleteReview function failed");
    }
};


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
