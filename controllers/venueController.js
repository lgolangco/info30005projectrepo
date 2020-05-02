const mongoose = require("mongoose");

// import venue model
const Venue = mongoose.model("venue")

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;


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

     // checks if the _id is invalid or there are no venues listed with that _id
     if (ObjectId.isValid(req.params._id) === false || venue.length === 0) {
       return res.send("There are no venues listed with this id");

     } else if (venue) {
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

    // checks if there are no venues listed with that venue_postcode
     if (venue.length === 0){
       return res.send("There are no venues listed with this postcode");
     } else if (venue) {
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

     // checks if there are no venues listed with that venue_type
      if (venue.length === 0){
        return res.send("There are no venues listed with this type")

      } else if (venue) {
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

  // checks if the _id is invalid or there are no venues listed with that _id
  await Venue.find({_id: req.params._id}, function(err, venue) {
    if (ObjectId.isValid(req.params._id) === false || venue.length === 0) {
      return res.send("There are no venues listed with this id");
    }
  })

  // update the venue with the prescribed _id
  await Venue.findOneAndUpdate(
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

  // checks if the _id is invalid or there are no venues listed with that _id
  await Venue.find({_id: req.params._id}, function(err, venue) {
    if (ObjectId.isValid(req.params._id) === false || venue.length === 0) {
      return res.send("There are no venues listed with this id");
    }
  })

  // delete the venue with the prescribed _id
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
