const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review_id: String,
    venue_id: String,
    user_id: String,
    review: String
});

const Review = mongoose.model("review", reviewSchema, "review");
module.exports = Review;
