// VENUE MODEL
const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  venueName: {type: String, required: true},
  venueType: {type: String, required: true},
  venueAddress: {
    venueStreetAddress: {type: String, required: true},
    venueSuburb: {type: String, required: true},
    venueState: {type: String, required: true},
    venuePostcode: {type: String, required: true}
  },
  venueDetails: {
    noise: {type: String, required: true},
    wifi: {type: Boolean, required: true},
    toilets: {type: Boolean, required: true},
    power: {type: Boolean, required: true},
    discussionFriendly: {type: Boolean, required: true},
    printer: {type: Boolean, required: true}
  },
  venueContact: {
    phone: {type: String, required: false},
    mobile: {type: String, required: false},
    email: {type: String, required: false},
    web: {type: String, required: false}
  },
  venueHours: {
    sun: {type: String, required: true},
    mon: {type: String, required: true},
    tue: {type: String, required: true},
    wed: {type: String, required: true},
    thu: {type: String, required: true},
    fri: {type: String, required: true},
    sat: {type: String, required: true}
  }
});

const Venue = mongoose.model("venue", venueSchema, "venue");
module.exports = Venue;
