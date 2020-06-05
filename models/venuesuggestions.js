// VENUE SUGGESTIONS MODEL
const mongoose = require("mongoose");

const venueSuggestionsSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, required: true},
  userName: {type: String},
  venueId: {type: mongoose.Types.ObjectId, required: true},
  venueName: {type: String},
  suggestion: {type: String, required: true},
  resolved: {type: Boolean, required: true},
});

const VenueSuggestions = mongoose.model("venueSuggestions", venueSuggestionsSchema, "venueSuggestions");
module.exports = VenueSuggestions;
