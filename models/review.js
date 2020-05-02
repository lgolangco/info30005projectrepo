const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    venueId: {type: mongoose.Types.ObjectId, ref: 'venue'},
    userId: {type: mongoose.Types.ObjectId, ref: 'user'},
    datePosted: {type: Date, default: Date.now},
    content: {type: String},
    rating: {type: Number, min:1, max:5, required: true}
});

const Review = mongoose.model("review", reviewSchema, "review");
module.exports = Review;
