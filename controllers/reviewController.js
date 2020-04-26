const mongoose = require("mongoose");

// import review model
const Review = mongoose.model("review");


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


// function to modify review by ID
const updateReview = async (req, res) => {
    await Review.update(
        {id: req.params.id},
        {$set: req.body},
        function(err) {
            if (!err) {
                return res.send("Successfully updated review");
            } else {
                res.status(400);
                return res.send("updateReview function failed");
            }
        }
    )
};


// function to add review
const addReview = async (req, res) => {
    res.send("adding Review");
};


// function to get review by id
const getReviewByID = async (req, res) => {
    Review.find({id: req.params.id}, function(err, review) {
        if (review) {
            res.send(review);
        } else {
            res.status(400);
            res.send("getReviewByID function doesn't work");
        }
    })
};

// remember to export the functions
module.exports = {
    getAllReviews,
    getReviewByID,
    addReview,
    updateReview
};
