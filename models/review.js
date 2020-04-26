const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review_id: String,
    user_id: String,
    first_name: String,
    last_name: String,
    review: String
});

const Review = mongoose.model("review", reviewSchema, "review");
module.exports = Review;
