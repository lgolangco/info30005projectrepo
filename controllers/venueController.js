const mongoose = require("mongoose");

// import venue, user, and suggestions model
const Venue = mongoose.model("venue");
const User = mongoose.model("user");
const VenueSuggestions = mongoose.model("venueSuggestions");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;

// function to handle a request to get all venues
const getAllVenues = async (req, res) => {
  try {
    const all_venues = await Venue.find();
    if (all_venues.length === 0){
      return res.render('venues', {
        title: "There are no existing venues yet"
      })
    } else {
      return res.render('venues', {
        title: "Venue List - All Venues",
        venues: all_venues
      });
    }
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};


// function to get venues by id and show venue profile
const getVenueByID = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
      return res.send("There are no venues listed with this id");
  }

  await Venue.find({_id: req.params._id}, function(err, venue) {
    // checks if the _id is invalid or there are no venues listed with that _id
    if (venue.length === 0) {
      return res.send("There are no venues listed with this id");

    } else if (venue) {
      return res.render('venueProfile', {
        venue: venue[0]
      });
      // return res.send(venue);
    } else {
      res.status(400);
      return res.send("getVenueByID function failed");
    }
  })
};

// function to get venues by id and show venue suggestions page
const getVenueSuggestionsByID = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user === null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to submit a suggestion"
    });
  }
  try {
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.send("There are no venues listed with this id");
    } else {
      return res.render('venueSuggestions', {
        venue: venue[0],
        user: user
      });
    }
  } catch (err) {
    res.status(400);
    return res.send("getVenueSuggestionsByID function failed");
  }
};

function convertSuggestions(suggestionRaw) {
  const suggestionProcessed = {
    userId: ObjectId(suggestionRaw.userId),
    venuedId: ObjectId(suggestionRaw.venueId),
    suggestion: suggestionRaw.suggestion,
    resolved: false
  }
  return suggestionProcessed;
}

const submitVenueSuggestion = async (req, res) => {
  // extract info. from body
  const suggestionProcessed = convertSuggestions(req.body)
  const db = mongoose.connection;
  try {
    await db.collection('venueSuggestions').insertOne(suggestionProcessed)
    return res.render('venueSuggestions', {
      completed: true
    });
  } catch(err){
    res.status(400);
    return res.send("submitVenueSuggestion failed");
  }
};


// function to get venues by id and show venue update page
const getVenueUpdateByID = async (req, res) => {
  try {
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.send("There are no venues listed with this id");
    } else {
      return res.render("venueUpdate", {
        title: "Update Profile",
        id: req.params._id,
        venue: venue[0]
      });
    }
  } catch (err) {
    res.status(400);
    return res.send("getVenueUpdateByID function failed");
  }
};

// function to get venues by postcode
const getVenueByPostcode = async (req, res) => {
   await Venue.find({venuePostcode: req.params.venuePostcode}, function(err, venue) {

    // checks if there are no venues listed with that venuePostcode
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
   await Venue.find({venueType: req.params.venueType}, function(err, venue) {

     // checks if there are no venues listed with that venueType
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


function convertVenue(venueRaw) {
  const venueProcessed = {
    venueName: venueRaw.venueName,
    venueType: venueRaw.venueType,
    venueAddress: {
      venueStreetAddress: venueRaw.venueStreetAddress,
      venueSuburb: venueRaw.venueSuburb,
      venueState: venueRaw.venueState,
      venuePostcode: venueRaw.venuePostcode
    },
    venueDetails: {
      noise: venueRaw.noise,
      wifi: Boolean(venueRaw.wifi),
      toilets: Boolean(venueRaw.toilets),
      power: Boolean(venueRaw.power),
      discussionFriendly: Boolean(venueRaw.discussionFriendly),
      printer: Boolean(venueRaw.printer)
    },
    venueContact: {
      phone: venueRaw.phonePrefix+ venueRaw.phone,
      mobile: venueRaw.mobilePrefix+ venueRaw.mobile,
      email: venueRaw.email,
      web: venueRaw.web,
    },
    venueHours: {
      sun: venueRaw.sun,
      mon: venueRaw.mon,
      tue: venueRaw.tue,
      wed: venueRaw.wed,
      thu: venueRaw.thu,
      fri: venueRaw.fri,
      sat: venueRaw.sat
    },
    venueStreetAddress: venueRaw.venueStreetAddress
   }
   return venueProcessed;
}

// function to add venue
const addVenue = async (req, res) => {
  // extract info. from body
   venueProcessed = convertVenue(req.body);
   const db = mongoose.connection;
   try {
     await db.collection('venue').insertOne(venueProcessed)
     return res.render('newVenue',{
       title: "Successfully added venue!",
     });
   } catch(err){
     res.status(400);
     return res.send("addVenue failed");
   }
};


// function to modify venue by ID
const updateVenue = async (req, res) => {
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
      return res.send("There are no venues listed with this id");
  }

  // checks if there are no venues listed with that _id
  await Venue.find({_id: req.params._id}, function(err, venue) {
    if (venue.length === 0) {
      return res.send("There are no venues listed with this id");
    }
  })

  const venue = await Venue.findById(req.params._id).lean().exec();
  // update the venue with the prescribed _id
  await Venue.findOneAndUpdate(
      {_id: req.params._id},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.status(200);
          return res.render("venueUpdate",{
            title: "Successfully updated venue!",
            venue: venue
          });
        } else {

          res.status(400);
          return res.render("venueUpdate",{
            title: "Venue update failed",
            venue: venue
          })
        }
      }
  )
};


// function to delete venue by ID
const deleteVenue = async (req, res) => {

  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
      return res.send("There are no venues listed with this id");
  }

  // checks if there are no venues listed with that _id
  await Venue.find({_id: req.params._id}, function(err, venue) {
    if (venue.length === 0) {
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
  deleteVenue,
  getVenueSuggestionsByID,
  getVenueUpdateByID,
  submitVenueSuggestion
};
