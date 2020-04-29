const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    venueId: {type: String, required: true},
    userId: {type: String, required: true},
    datePosted: {type: Date, default: Date.now},
    content: {type: String, required: true},
    rating: {type: Number, min:1, max:5}
});

const Review = mongoose.model("review", reviewSchema, "review");
module.exports = Review;
