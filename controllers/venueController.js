const mongoose = require("mongoose");

// import venue model
const Venue = mongoose.model("venue")

// function to handle a request to get all venues
const getAllVenues = async (req, res) => {
  try {
    const all_venues = await Venue.find();
    return res.send(all_venues);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};


// function to modify venue by ID
const updateVenue = async (req, res) => {
  await Venue.update(
      {id: req.params.id},
      {$set: req.body},
      function(err) {
        if (!err) {
          return res.send("Successfully updated venue");
        } else {
          res.status(400);
          return res.send("updateVenue function failed");
        }
      }
  )
};


// function to add venue
const addVenue = async (req, res) => {
  try {
    const all_venues = await Venue.find();
    return res.send(all_venues);
  // extract info. from body
  // try and catch
  // prevent users from adding another entry with the same id (what else?)
   const venue = req.body;
   const db = mongoose.connection
   db.collection('venue').insertOne(venue);
   return res.send("Successfully added a venue");

 };


// function to get venues by id
const getVenueByID = async (req, res) => {
   await Venue.find({id: req.params.id}, function(err, venue) {
      if (venue) {
        res.send(venue);
      } else {
        res.status(400);
        res.send("getVenueByID function failed")
      }
    }
  )
};


// remember to export the functions
module.exports = {
  getAllVenues,
  getVenueByID,
  addVenue,
  updateVenue
};
