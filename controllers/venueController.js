const mongoose = require("mongoose");

// import venue, user, and suggestions model
const Venue = mongoose.model("venue");
const User = mongoose.model("user");
const VenueSuggestions = mongoose.model("venueSuggestions");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;

// function to handle a request to get all venues
const getAllVenues = async (req, res) => {
  var title = "Venue List - Matching Venues";
  const search = [];

  try {
    if(req.query) {
      if (req.query.type) {
        const regexType = new RegExp(escapeRegex(req.query.type), 'gi');
        search.push({venueType: regexType});
      }
      if (req.query.discussionFriendly) {
        search.push({"venueDetails.discussionFriendly": req.query.discussionFriendly});
      }
      if (req.query.wifi) {
        search.push({"venueDetails.wifi": req.query.wifi});
      }
      if (req.query.toilets) {
        search.push({"venueDetails.toilets": req.query.toilets});
      }
      if (req.query.power) {
        search.push({"venueDetails.power": req.query.power});
      }
      if (req.query.printer) {
        search.push({"venueDetails.printer": req.query.printer});
      }

      if (req.query.searchType) {
        const regexType = new RegExp(escapeRegex(req.query.searchType), 'gi');
        search.push({venueType: regexType});
      }

      if (req.query.search && req.query.searchLocation) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const regexLocation = new RegExp(escapeRegex(req.query.searchLocation), 'gi');
        search.push({venueName: regex}, {"venueAddress.venueSuburb": regexLocation});
      } else if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        search.push({venueName: regex})
      } else if (req.query.searchLocation) {
        const regexLocation = new RegExp(escapeRegex(req.query.searchLocation), 'gi');
        search.push({"venueAddress.venueSuburb": regexLocation})
      }
    } else {
      title = "Venue List - All Venues";
      search.push({})
    }

    console.log(search);
    search.push({})
    Venue.find({
      $and: search
    }, function (err, allVenues) {
      if (allVenues.length < 1) {
        title = "No venue match that query, please try again.";
      }
      res.render('venues', {
        title: title,
        venues: allVenues
      })
    });
  } catch(err) {
    console.log(err);
    Venue.find({}, function (err, allVenues) {
      if (allVenues.length < 1) {
        title = "Database query failed.";
      }
      res.render('venues', {
        title: title,
        venues: allVenues
      })
    });
  }
}

function escapeRegex(text) {
  try{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  } catch(err) {
    return text
  }
}


// // function to handle a request to get all venues
// const getAllVenues = async (req, res) => {
//   try {
//     const all_venues = await Venue.find();
//     if (all_venues.length === 0){
//       return res.render('venues', {
//         title: "There are no existing venues yet"
//       })
//     } else {
//       return res.render('venues', {
//         title: "Venue List - All Venues",
//         venues: all_venues
//       });
//     }
//   } catch (err) {
//     res.status(400);
//     return res.render('error', {
//       error: "Database query failed",
//       message: "Database query failed",
//       functionfailure: "Failed to get all venues"
//     });
//   }
// };


// function to get venues by id and show venue profile
const getVenueByID = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }
  await Venue.find({_id: req.params._id}, function(err, venue) {
    // checks if the _id is invalid or there are no venues listed with that _id
    if (venue.length === 0) {
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });

    } else if (venue) {
      return res.render('venueProfile', {
        venue: venue[0]
      });
      // return res.send(venue);
    } else {
      res.status(400);
      return res.render('error', {
        error: "Database query failed",
        message: "Database query failed",
        functionfailure: "Failed to get venue profile"
      });
    }
  })
};

// function to get venues by id and show venue suggestions page
const getVenueSuggestionsByID = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }
  const user = await User.findById(req.user._id);
  if (user === null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to submit a suggestion"
    });
  }
  try {
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {
      return res.render('venueSuggestions', {
        venue: venue[0],
        user: user
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get suggestions page"
    });
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
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to submit suggestions"
    });
  }
};


// function to get venues by id and show venue update page
const getVenueUpdateByID = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }
  try {
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {
      return res.render("venueUpdate", {
        title: "Update Profile",
        id: req.params._id,
        venue: venue[0],
        completed: false
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get update venue"
    });
  }
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
      phonePrefix: venueRaw.phonePrefix,
      phone: venueRaw.phone,
      mobilePrefix: venueRaw.mobilePrefix,
      mobile: venueRaw.mobile,
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
     return res.render("newvenue",{
       title: "Successfully added venue!",
       completed: true
     });
   } catch(err){
     res.status(400);
     console.log(err);
     return res.render('error', {
       error: "Database query failed",
       message: "Database query failed",
       functionfailure: "Failed to add venue"
     });
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


  venueProcessed = convertVenue(req.body);
  // update the venue with the prescribed _id
  await Venue.findOneAndUpdate(
      {_id: req.params._id},
      {$set: venueProcessed},
      function(err) {
        if (!err) {

          res.status(200);
          return res.render("venueUpdate",{
            title: "Successfully updated venue!",
            venue: venueProcessed,
            completed: true
          });
        } else {

          res.status(400);
          return res.render('error', {
            error: "Database query failed",
            message: "Database query failed",
            functionfailure: "Failed to update venue"
          });
        }
      }
  )
};


// function to delete venue by ID
const deleteVenue = async (req, res) => {

  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }

  // checks if there are no venues listed with that _id
  await Venue.find({_id: req.params._id}, function(err, venue) {
    if (venue.length === 0) {
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    }
  })

  // delete the venue with the prescribed _id
  const result = await Venue.deleteOne({_id: req.params._id}).exec();
  if (result.n === 0) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to delete venue"
    });
  } else {
    res.render("venueProfile",{
      deleted: true
    });
    return false;
    }
}

// not yet implemented on front-end
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

// not yet implemented on front-end
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
