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

// function to get venues by id
const getVenueByID = async (req, res) => {
   await Venue.find({_id: req.params._id}, function(err, venue) {
      if (venue) {
        return res.send(venue);
      } else {
        res.status(400);
        return res.send("getVenueByID function failed");
      }
    }
  )
};

// function to get venues by postcode
const getVenueByPostcode = async (req, res) => {
   await Venue.find({venue_postcode: req.params.venue_postcode}, function(err, venue) {
      if (venue) {
        return res.send(venue);
      } else {
        res.status(400);
        return res.send("getVenueByPostcode function failed");
      }
    }
  )
};

// function to get venues by type
const getVenueByType = async (req, res) => {
   await Venue.find({venue_type: req.params.venue_type}, function(err, venue) {
      if (venue) {
        return res.send(venue);
      } else {
        res.status(400);
        return res.send("getVenueByType function failed");
      }
    }
  )
};

// function to add venue
const addVenue = async (req, res) => {
  // extract info. from body
   const venue = req.body;
   const db = mongoose.connection
   try {
     await db.collection('venue').insertOne(venue);
     return res.send("Successfully added a venue");
   } catch(err){
     res.status(400);
     return res.send("addVenue failed");
   }};

// function to modify venue by ID
const updateVenue = async (req, res) => {
  await Venue.update(
      {_id: req.params._id},
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

// function to delete venue by ID
const deleteVenue = async (req, res) => {
  const result = await Venue.deleteOne({_id: req.params._id}).exec();
  if (result.n === 0) {
    res.status(400);
    return res.send("deleteVenue function failed");
  } else {
    return res.send("Successfully deleted venue");
  }
}


// remember to export the functions
module.exports = {
  getAllVenues,
  getVenueByID,
  getVenueByPostcode,
  getVenueByType,
  addVenue,
  updateVenue,
  deleteVenue
};
