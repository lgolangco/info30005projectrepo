const mongoose = require('mongoose');
// import object id type to check if request _id is valid
const ObjectId = mongoose.Types.ObjectId;

// import review model
const Review = mongoose.model("review");
const User = mongoose.model("user");
const Venue = mongoose.model("venue");


// function to handle a request to get all reviews
const getAllReviews = async (req, res) => {
    await Review.find({}, function (err, reviews) {
        if (reviews.length) {
            console.log("Getting all reviews");
            return res.send(reviews);
        } else if (reviews.length === 0){
            console.log("There are no existing reviews yet");
            return res.send("There are no existing reviews yet")
        } else {
            console.log("Failed to getAllReviews");
            res.status(400);
            return res.send("Failed to getAllReviews")
        }
    })
};

function convertReviews(reviewRaw) {

  const reviewProcessed = {
    venueId: ObjectId(reviewRaw.venueId),
    userId: ObjectId(reviewRaw.userId),
    userFirstName: reviewRaw.userFirstName,
    userLastName: reviewRaw.userLastName,
    datePosted:new Date(),
    content: reviewRaw.review,
    rating: parseInt(reviewRaw.star)
  }

  return reviewProcessed;
}

// function to find all reviews for a venue
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

// function to add review
const addReview = async (req, res) => {
  const reviewProcessed = convertReviews(req.body)
  const db = mongoose.connection;
  try {
    await db.collection('review').insertOne(reviewProcessed)
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {


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
          venuesReviews: result,
          completed: true,
          newReview: reviewProcessed
        });
      });

      // return res.render('venueProfile', {
      //   venue: venue[0],
      //   user: req.user,
      //   completed: true,
      //   newReview: reviewProcessed
      // });
    }
  } catch(err){
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to submit suggestions"
    });
  }
};


// function to get review by venue and user ID
const getReviewByIDs = async (req, res) => {
    if (!(ObjectId.isValid(req.params.userId) && ObjectId.isValid(req.params.venueId))) {
        console.log("Failed to getReviewByIDs due to invalid venueId %s or userId %s", req.params.venueId, req.params.userId);
        res.status(400);
        return res.send("Failed to getReviewByIDs due to invalid venueId " + req.params.venueId + " or userId " + req.params.userId);
    }
    await Review.find({venueId: req.params.venueId, userId: req.params.userId}, function(err, review) {
        if (review.length) {
            console.log("Listing reviews with venueId %s and userId %s", req.params.venueId, req.params.userId);
            return res.send(review);
        } else {
            console.log("Failed to getReviewByIDs for venueId %s and userId %s", req.params.venueId, req.params.userId);
            res.status(400);
            return res.send("Failed to getReviewByIDs for venueId " + req.params.venueId + " and userId " + req.params.userId);
        }
    })
};


// function to get reviews by venue ID
const getReviewByVenueID = async (req, res) => {
    if (!ObjectId.isValid(req.params.venueId)) {
        console.log("Failed to getReviewByVenueID due to invalid venueId %s", req.params.venueId);
        res.status(400);
        return res.send("Failed to getReviewByVenueID due to invalid venueId " + req.params.venueId);
    }
    await Review.find({venueId: req.params.venueId}, function(err, reviews) {
        if (reviews.length) {
            console.log("Listing reviews with venueId %s", req.params.venueId);
            return res.send(reviews);
        } else {
            console.log("Failed to getReviewByVenueID for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to getReviewByVenueID for venueId " + req.params.venueId);
        }
    })
};


// function to get review by user ID
const getReviewByUserID = async (req, res) => {
    if (!ObjectId.isValid(req.params.userId)) {
        console.log("Failed to getReviewByUserID due to invalid userId %s", req.params.userId);
        res.status(400);
        return res.send("Failed to getReviewByUserID due to invalid userId " + req.params.userId);
    }
    await Review.find({userId: req.params.userId}, function(err, reviews) {
        if (reviews.length) {
            console.log("Listing reviews with userId %s", req.params.userId);
            return res.send(reviews);
        } else {
            console.log("Failed to getReviewByUserID for userId %s", req.params.userId);
            res.status(400);
            return res.send("Failed to getReviewByUserID for userId " + req.params.userId);
        }
    })
};

// function to get update review page by review ID
const getUpdateReviewPage = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no reviews with this id!",
      message: "There are no reviews with this id!",
      reviewerror: "To see a list of all registered venues, and access the reviews for each,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete your review"
    });
  }
  const user = await User.findById(req.user._id);
  try {
    const review = await Review.findById(req.params._id);
    if (review === null){
      return res.render('error', {
        error: "There are no reviews with this id!",
        message: "There are no reviews with this id!",
        reviewerror: "To see a list of all registered venues, and access the reviews for each,"
      });
    } else if (user._id.toString() !== review.userId.toString()){
      return res.render('error', {
        error: "You are not authorised to delete this review!",
        message: "You are not authorised to delete this review - users can only delete their own reviews!",
        reviewerror: "To see a list of all registered venues, and access the reviews for each,"
      });
    } else {
      const venue = await Venue.findById(review.venueId);
      return res.render("reviewUpdate", {
        venue: venue,
        user: user,
        review: review
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get delete review page"
    });
  }
};

// function to modify review by ID
const updateReview = async (req, res) => {
  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
      return res.send("There are no venues listed with this id");
  }

  // checks if there are no venues listed with that _id
  await Review.find({_id: req.params._id}, function(err, review) {
    if (review.length === 0) {
      return res.send("There are no reviews listed with this id");
    }
  })

  console.log("REQ.BODY");
  console.log(req.body);
  reviewProcessed = convertReviews(req.body);
  // update the venue with the prescribed _id
  await Review.findOneAndUpdate(
      {_id: req.params._id},
      {$set: reviewProcessed},
      function(err) {
        if (!err) {
          venue = Venue.findById(reviewProcessed.venueId);
          venue.then(function(result){
            res.status(200);
            return res.render("reviewUpdate",{
              review: reviewProcessed,
              venue: result,
              completed: true
            });
          });
        } else {

          res.status(400);
          return res.render('error', {
            error: "Database query failed",
            message: "Database query failed",
            functionfailure: "Failed to update review"
          });
        }
      }
  )
};


// function to get venues by id and show venue suggestions page
const getDeleteReviewByID = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no reviews with this id!",
      message: "There are no reviews with this id!",
      reviewerror: "To see a list of all registered venues, and access the reviews for each,"
    });
  }
  if (req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to delete your review"
    });
  }
  const user = await User.findById(req.user._id);
  try {
    const review = await Review.findById(req.params._id);
    if (review === null){
      return res.render('error', {
        error: "There are no reviews with this id!",
        message: "There are no reviews with this id!",
        reviewerror: "To see a list of all registered venues, and access the reviews for each,"
      });
    } else if (user._id.toString() !== review.userId.toString()){
      return res.render('error', {
        error: "You are not authorised to delete this review!",
        message: "You are not authorised to delete this review - users can only delete their own reviews!",
        reviewerror: "To see a list of all registered venues, and access the reviews for each,"
      });
    } else {
      const venue = await Venue.findById(review.venueId);
      return res.render("deleteReview", {
        venue: venue,
        user: user,
        review: review
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: err,
      functionfailure: "Failed to get delete review page"
    });
  }
};

// function to delete venue by ID
const deleteReview = async (req, res) => {

  // checks if the _id is invalid
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no reviews with this id!",
      message: "There are no reviews with this id!",
      reviewerror: "To see a list of all registered venues, and access the reviews for each,"
    });
  }

  // checks if there are no reviews listed with that _id
  await Review.find({_id: req.params._id}, function(err, review) {
    if (review.length === 0) {
      return res.render('error', {
        error: "There are no reviews with this id!",
        message: "There are no reviews with this id!",
        reviewerror: "To see a list of all registered venues, and access the reviews for each,"
      });
    }
  })

  // delete the review with the prescribed _id
  const result = await Review.deleteOne({_id: req.params._id}).exec();
  if (result.n === 0) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to delete review"
    });
  } else {
    res.render("deleteReview",{
      deleted: true
    });
    return false;
  }
}


// export functions
module.exports = {
    getAllReviews,
    addReview,
    getReviewByIDs,
    getReviewByVenueID,
    getReviewByUserID,
    getUpdateReviewPage,
    updateReview,
    getDeleteReviewByID,
    deleteReview,
};
