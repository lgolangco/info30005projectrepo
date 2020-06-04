// VENUE REQUESTS model
const mongoose = require("mongoose");

const venueRequestsSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, ref: 'user'},
  userName: {type: String, required: true},
  venueName: {type: String, required: true},
  venueType: {type: String, required: true},
  venueAddress: {
    venueStreetAddress: {type: String, required: true},
    venueSuburb: {type: String, required: true},
    venueState: {type: String, required: true},
    venuePostcode: {type: String, required: true}
  },
  venueDetails: {
    noise: {type: String, required: false},
    wifi: {type: Boolean, required: false},
    toilets: {type: Boolean, required: false},
    power: {type: Boolean, required: false},
    discussionFriendly: {type: Boolean, required: false},
    printer: {type: Boolean, required: false}
  },
  venueContact: {
    phonePrefix: {type: String, required: false},
    phone: {type: String, required: false},
    mobilePrefix: {type: String, required: false},
    mobile: {type: String, required: false},
    email: {type: String, required: false},
    web: {type: String, required: false}
  },
  venueHours: {
    sun: {type: String, required: false},
    mon: {type: String, required: false},
    tue: {type: String, required: false},
    wed: {type: String, required: false},
    thu: {type: String, required: false},
    fri: {type: String, required: false},
    sat: {type: String, required: false}
  }
});

const VenueRequests = mongoose.model("venueRequests", venueRequestsSchema, "venueRequests");
module.exports = VenueRequests;
