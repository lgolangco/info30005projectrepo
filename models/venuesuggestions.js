// VENUE SUGGESTIONS MODEL
const mongoose = require("mongoose");

const venueSuggestionsSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, required: true},
  venueId: {type: mongoose.Types.ObjectId, required: true},
  suggestion: {type: String, required: true}
});

const VenueSuggestions = mongoose.model("venueSuggestions", venueSuggestionsSchema, "venueSuggestions");
module.exports = VenueSuggestions;
