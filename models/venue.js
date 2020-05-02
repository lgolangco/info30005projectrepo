// VENUE MODEL
const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  venueName: {type: String, required: true},
  venueType: {type: String, required: true},
  venueStreetAddress: {type: String, required: true},
  venueSuburb: {type: String, required: true},
  venueState: {type: String, required: true},
  venuePostcode: {type: String, required: true}
});

const Venue = mongoose.model("venue", venueSchema, "venue");
module.exports = Venue;
