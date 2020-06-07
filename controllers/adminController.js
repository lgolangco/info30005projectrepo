const mongoose = require("mongoose");

// import venue, user, and suggestions model
const Venue = mongoose.model("venue");
const User = mongoose.model("user");
const Review = mongoose.model("review");
const VenueRequests = mongoose.model("venueRequests");
const VenueSuggestions = mongoose.model("venueSuggestions");

// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;

// function to get admin page
const getAdminPage = async (req, res) => {

  if (req.user && req.user.admin) {

    const allRequests = await VenueRequests.find();
    const allSuggestions = await VenueSuggestions.find();

    return res.render("admin", {
      venueRequests: allRequests,
      venueSuggestions: allSuggestions,
      user: req.user,
      admin: req.user.admin
    });
  }
};

//function to get Delete Venue Request page
const getDeleteRequestPage = async (req, res) => {

  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue requests with this id!",
      message: "There are no venue requests with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete this venue request"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to delete this venue request"
    });
  }

  try {
    const venueRequest = await VenueRequests.findById(req.params._id);
    if (venueRequest === null){
      return res.render('error', {
        error: "There are no venue requests with this id!",
        message: "There are no venue requests with this id!",
        venueRequesterror: "To return to admin page,"
      });

    } else {
      return res.render("adminDeleteRequest", {
        user: req.user,
        venueRequest: venueRequest
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get delete venue Request page"
    });
  }
};

const postDeleteRequest = async (req,res) => {
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue requests with this id!",
      message: "There are no venue requests with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete this venue request"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to delete this venue request"
    });
  }

  // checks if there are no venues listed with that _id
  await VenueRequests.find({_id: req.params._id}, function(err, venue) {
    if (venue.length === 0) {
      return res.render('error', {
        error: "There are no venue requests with this id!",
        message: "There are no venue requests with this id!",
        venueRequesterror: "To return to admin page,"
      });
    }
  })

  // delete the venue with the prescribed _id
  const result = await VenueRequests.deleteOne({_id: req.params._id}).exec();
  if (result.n === 0) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to delete venue request"
    });
  } else {
    res.render("adminDeleteRequest",{
      deleted: true
    });
    return false;
    }
};


const getResolveRequestPage = async (req,res) => {
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue requests with this id!",
      message: "There are no venue requests with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to resolve this venue request"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to resolve this venue request"
    });
  }
  try {
    // checks if there are no venues listed with that _id
    await VenueRequests.find({_id: req.params._id}, function(err, venueRequest) {
      if (venueRequest.length === 0) {
        return res.render('error', {
          error: "There are no venue requests with this id!",
          message: "There are no venue requests with this id!",
          venueRequesterror: "To return to admin page,"
        });
      } else {
        console.log(venueRequest);
        return res.render("adminResolveRequest", {
          user: req.user,
          venueRequest: venueRequest[0],
          completed: false
        })
      }
    })
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

const postResolveRequest = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue requests with this id!",
      message: "There are no venue requests with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to resolve this venue request"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to resolve this venue request"
    });
  }

  venueProcessed = convertVenue(req.body);
  const db = mongoose.connection;

  try {
    await db.collection('venue').insertOne(venueProcessed);
    const result = await VenueRequests.deleteOne({_id: req.params._id}).exec();

    if (result.n === 0) {
      res.status(400);
      return res.render('error', {
        error: "Database query failed",
        message: "Database query failed",
        functionfailure: "Failed to delete venue request after posting"
      });

    } else {
      res.render("adminResolveRequest", {
        completed: true
      })
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get resolve venue request page"
    });
  }
};



const getDeleteSuggestionPage = async (req, res) => {

  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue suggestions with this id!",
      message: "There are no venue suggestions with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete this venue suggestion"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to delete this venue suggestion"
    });
  }

  try {

    const venueSuggestion = await VenueSuggestions.findById(req.params._id);
    if (venueSuggestion === null){
      return res.render('error', {
        error: "There are no venue suggestions with this id!",
        message: "There are no venue suggestions with this id!",
        venueRequesterror: "To return to admin page,"
      });

    } else {
      return res.render("adminDeleteSuggestion", {
        venueSuggestion: venueSuggestion,
        deleted: false
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get delete venue suggestions page"
    });
  }
};

const postDeleteSuggestionPage = async (req, res) => {
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue suggestions with this id!",
      message: "There are no venue suggestions with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }

  // checks if there are no venues listed with that _id
  await VenueSuggestions.find({_id: req.params._id}, function(err, venue) {
    if (venue.length === 0) {
      return res.render('error', {
        error: "There are no venue suggestions with this id!",
        message: "There are no venue suggestions with this id!",
        venueRequesterror: "To return to admin page,"
      });
    }
  })

  // delete the venue with the prescribed _id
  const result = await VenueSuggestions.deleteOne({_id: req.params._id}).exec();
  if (result.n === 0) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to delete venue request"
    });
  } else {
    res.render("adminDeleteSuggestion",{
      deleted: true
    });
    return false;
    }

};

const getResolveSuggestionPage = async (req,res) => {



// checks if the _id is invalid
if (ObjectId.isValid(req.params._id) === false) {
  return res.render('error', {
    error: "There are no venue suggestions with this id!",
    message: "There are no venue suggestions with this id!",
    venueRequesterror: "To return to admin page,"
  });
}
if (req.user == null) {
  return res.render('error', {
    error: "You're not logged in!",
    message: "You must be logged in to delete this venue suggestion"
  });
}
else if (req.user.admin == false) {
  return res.render('error', {
    error: "You're not an admin!",
    message: "You must be an admin to delete this venue suggestion"
  });
}
try {
  // checks if there are no venues listed with that _id

  await VenueSuggestions.find({_id: req.params._id}, function(err, venueSuggestion) {
    if (venueSuggestion.length === 0) {
      return res.render('error', {
        error: "There are no venue suggestions with this id!",
        message: "There are no venue suggestions with this id!",
        venueRequesterror: "To return to admin page,"
      });
    } else {

      venueData = Venue.findById(venueSuggestion[0].venueId);
      venueData.then(function(result){
        if (req.user === undefined){
          user = null;
        } else {
          return res.render("adminResolveSuggestion", {
            venueSuggestion: venueSuggestion[0],
            venue: result,
            completed: false

          });
        }
      })
    }
  })
} catch (err) {
  res.status(400);
  return res.render('error', {
    error: "Database query failed",
    message: "Database query failed",
    functionfailure: "Failed to get update venue"
  });
}

};

const postResolveSuggestionPage = async (req, res) => {
  console.log("one");
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venue suggestions with this id!",
      message: "There are no venue suggestions with this id!",
      venueRequesterror: "To return to admin page,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to resolve this venue suggestion"
    });
  }
  else if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to resolve this venue suggestion"
    });
  }
  console.log("two");
  venueProcessed = convertVenue(req.body);
  console.log("three");
  const db = mongoose.connection;
  console.log("four");

  try {
    console.log("five");
    console.log(venueProcessed)
    await Venue.findOneAndUpdate(
      {_id: req.body.venueId},
      {$set: venueProcessed},
      function(err) {

        if (!err){
          console.log("umm");
          const result = VenueSuggestions.deleteOne({_id: req.params._id}).exec();
          console.log("six");

          if (result.n === 0) {
            console.log("oh no");
            res.status(400);
            return res.render('error', {
              error: "Database query failed",
              message: "Database query failed",
              functionfailure: "Failed to delete venue suggestion after posting"
            });

          } else {
            console.log("seven");
            res.render("adminResolveSuggestion", {
              completed: true,
              venue: venueProcessed
            })
          }
        } else {
          res.status(400);
          return res.render('error', {
            error: "Database query failed",
            message: err,
            functionfailure: "Failed to post resolve venue request page"
          });
        }
      }
    )
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to post resolve venue request page"
    });
  }

};

module.exports = {
  getAdminPage,
  getDeleteRequestPage,
  postDeleteRequest,
  getResolveRequestPage,
  postResolveRequest,
  getDeleteSuggestionPage,
  postDeleteSuggestionPage,
  getResolveSuggestionPage,
  postResolveSuggestionPage
};
