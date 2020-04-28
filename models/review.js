const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    venue_id: String,
    user_id: String,
    date_posted: {type: Date, default: Date.now},
    content: String,
    rating: {type:Number, min:1, max:5}
});

const Review = mongoose.model("review", reviewSchema, "review");
module.exports = Review;
