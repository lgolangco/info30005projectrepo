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
const updateVenue = async (req, res, next) => {
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


// function to add user
const addVenue = async (req, res) => {
  try {
    const all_venues = await Venue.find();
    return res.send(all_venues);
  // extract info. from body
  // need to add a checker which ensures you cannot add 2 of the same idea
   const venue = req.body;
   const db = mongoose.connection
   db.collection('venue').insertOne(venue);
   return res.send("Successfully added a venue");
  } catch (err) {
    res.status(400);
    return res.send("addVenue function failed");
  }
};


// function to get venues by id
const getVenueByID = async (req, res) => {
   Venue.find({id: req.params.id}, function(err, user) {
      if (user) {
        res.send(user);
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
