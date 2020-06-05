const mongoose = require("mongoose");

// import venue, user, and suggestions model
const Venue = mongoose.model("venue");
const User = mongoose.model("user");
const Review = mongoose.model("review");
const VenueSuggestions = mongoose.model("venueSuggestions");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;


// function to handle a request to get all venues
const getAllVenues = async (req, res) => {
  var title = "Venue List - Matching Venues";
  const search = [];
  filters = [];
  var noise = 'Any';
  var typeV = 'Any';
  var nameV = '';
  var locV = '';

  try {
    if(req.query) {
      console.log(req.query,filters,noise,req.query.noise);
      if (req.query.type === "Any") {
        search.splice(0,1);
        typeV = req.query.type;
      } else if (req.query.type) {
        const regexType = new RegExp(escapeRegex(req.query.type), 'gi');
        search.splice(0,1);
        search.push({venueType: regexType});
        typeV = req.query.type;
      } else if (req.query.searchType) {
        const regexType = new RegExp(escapeRegex(req.query.searchType), 'gi');
        search.push({venueType: regexType});
        typeV = req.query.searchType;
      }
      if (req.query.discussionFriendly) {
        search.push({"venueDetails.discussionFriendly": req.query.discussionFriendly});
        filters.push('discussionFriendly');
      }
      if (req.query.noise && req.query.noise !== 'Any') {
        search.push({"venueDetails.noise": req.query.noise});
        noise = req.query.noise;
      }
      if (req.query.wifi) {
        search.push({"venueDetails.wifi": req.query.wifi});
        filters.push('wifi');
      }
      if (req.query.toilets) {
        search.push({"venueDetails.toilets": req.query.toilets});
        filters.push('toilets');
      }
      if (req.query.power) {
        search.push({"venueDetails.power": req.query.power});
        filters.push('power');
      }
      if (req.query.printer) {
        search.push({"venueDetails.printer": req.query.printer});
        filters.push('printer');
      }
      if (req.query.search && req.query.searchLocation) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const regexLocation = new RegExp(escapeRegex(req.query.searchLocation), 'gi');
        search.push({venueName: regex}, {"venueAddress.venueSuburb": regexLocation});
        nameV = req.query.search;
        locV = req.query.searchLocation;
      } else if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        search.push({venueName: regex});
        nameV = req.query.search;
      } else if (req.query.searchLocation) {
        const regexLocation = new RegExp(escapeRegex(req.query.searchLocation), 'gi');
        search.push({"venueAddress.venueSuburb": regexLocation})
        locV = req.query.searchLocation;
      }
    } else {
      title = "Venue List - All Venues";
      search.push({})
    }

    console.log(search);
    search.push({});
    Venue.find({
      $and: search
    }, function (err, allVenues) {
      if (allVenues.length < 1) {
        title = "No venue match that query, please try again.";
      }
      res.render('venues', {
        title: title,
        venues: allVenues,
        filters: filters,
        noise: noise,
        typeV: typeV,
        nameV: nameV,
        locV: locV,
        user: req.user
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
        venues: allVenues,
        user: req.user
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
      console.log("LOOKING FOR ID");
      console.log(req.params._id);
      venuesReviews = findVenuesReviews(req.params._id);
      venuesReviews.then(function(result){
        if (req.user === undefined){
          user = null;
        } else {
          user = req.user;
        }
        return res.render('venueProfile', {
          venue: venue[0],
          user: user,
          venuesReviews: result
        });
      });
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

const findVenuesReviews = async (venueId) => {
  const venuesReviews = await Review.find({venueId: venueId});
  console.log("venuesReviews");
  console.log(venuesReviews);
  if (venuesReviews.length === 0){
    console.log("no reviews found");
    return false
  } else {
    console.log("success")
    return venuesReviews;
  }
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
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to submit a suggestion"
    });
  }
  const user = await User.findById(req.user._id);
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
  console.log("converting suggestions");
  const suggestionProcessed = {
    userId: ObjectId(suggestionRaw.userId),
    userName: suggestionRaw.userName,
    venueId: ObjectId(suggestionRaw.venueId),
    venueName: suggestionRaw.venueName,
    suggestion: suggestionRaw.suggestion,
    resolved: false
  }
  console.log(suggestionProcessed);
  return suggestionProcessed;
}

const submitVenueSuggestion = async (req, res) => {
  console.log("submitting venue suggestion");
  // extract info. from body
  const suggestionProcessed = convertSuggestions(req.body)
  console.log("called convert function");
  console.log(suggestionProcessed);
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
  console.log(venueProcessed);
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

// function to render delete venue confirmation page
const getDeleteVenueConfirmationPage = async (req, res) => {

  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues with this id!",
      message: "There are no venues with this id!",
      venueerror: "To see a list of all registered venues,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete this venue"
    });
  }

  const user = await User.findById(req.user._id);

  try {
    const venue = await Venue.findById(req.params._id);
    if (venue === null){
      return res.render('error', {
        error: "There are no venues with this id!",
        message: "There are no venues with this id!",
        venueerror: "To see a list of all registered venues,"
      });

    } else {
      return res.render("venueDelete", {
        venue: venue
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get delete venue page"
    });
  }
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
    res.render("venueDelete",{
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

const getRequestNew = async (req, res) => {
  try {
    if (req.user == null) {
      return res.render ("error", {
        error: "You must be logged in to request a new venue!",
        message: "You must be logged in to request a new venue!"
      });
    } else {
      const user = await User.findById(req.user._id);
      return res.render("venueRequestNew", {user: user});
    };
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Failed to load venueRequestNew page",
      message: "Failed to load venueRequestNew page",
    });

  }
};

const addRequestNew = async (req, res) => {
  // extract info. from body
   newVenueProcessed = convertVenue(req.body);
   newVenueProcessed.userId = ObjectId(req.body.userId);
   newVenueProcessed.userFirstName = req.body.userFirstName;
   newVenueProcessed.userLastName = req.body.userLastName;
   const db = mongoose.connection;
   try {
     await db.collection('venueRequests').insertOne(newVenueProcessed)
     return res.render("venueRequestNew",{
       completed: true,
       newVenue: newVenueProcessed
     });
   } catch(err){
     res.status(400);
     console.log(err);
     return res.render('error', {
       error: "Database query failed",
       message: "Database query failed",
       functionfailure: "Failed to post new venue request"
     });
   }
};

// function to add venue to user's bookmarks
const bookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {
      console.log("added to bookmarks");
      user.bookmarks.push(req.params._id);
      user.save();
      return res.redirect("/venue/"+req.params._id);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "You're not logged in yet",
      functionfailure: "Failed to add bookmark"
    });
  }
}

// function to add venue to user's bookmarks
const removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {
      console.log("added to bookmarks");
      user.bookmarks.pull(req.params._id);
      user.save();
      return res.redirect("/venue/"+req.params._id);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "You're not logged in yet",
      functionfailure: "Failed to add bookmark"
    });
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
  getDeleteVenueConfirmationPage,
  deleteVenue,
  getVenueSuggestionsByID,
  getVenueUpdateByID,
  submitVenueSuggestion,
  getRequestNew,
  addRequestNew,
  bookmark,
  removeBookmark
};
