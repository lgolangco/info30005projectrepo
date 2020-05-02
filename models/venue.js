// VENUE MODEL
const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  venue_name: String,
  venue_type: String,
  venue_streetaddress: String,
  venue_suburb: String,
  venue_state: String,
  venue_postcode: String
});

const Venue = mongoose.model("venue", venueSchema, "venue");
module.exports = Venue;
