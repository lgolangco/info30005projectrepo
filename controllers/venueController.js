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
          return res.send("Successfully updated user");
        } else {
          res.status(400);
          return res.send("updateUser function failed");
        }
      }
  )
};


// function to add user
const addVenue = async (req, res) => {
  // extract info. from body
   const venue = req.body;

   // add author to array
   authors.push(venue);
   res.send(authors);
 };


// function to get venues by id
const getVenueByID = async (req, res) => {
   Venue.find({id: req.params.id}, function(err, user) {
      if (user) {
        res.send(user);
      } else {
        res.status(400);
        res.send("getUserByID function doesn't work")
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
