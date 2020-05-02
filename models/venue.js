// VENUE MODEL
const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  venue_name: {type: String, required: true},
  venue_type: {type: String, required: true},
  venue_streetaddress: {type: String, required: true, unique: true},
  venue_suburb: {type: String, required: true},
  venue_state: {type: String, required: true},
  venue_postcode: {type: String, required: true}
});

const Venue = mongoose.model("venue", venueSchema, "venue");
module.exports = Venue;
