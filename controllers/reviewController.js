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


// function to modify review by venue and user
const updateReview = async (req, res) => {
    if (!(ObjectId.isValid(req.body.userId) && ObjectId.isValid(req.params.venueId))) {
        console.log("Failed to updateReview due to invalid venueId %s or userId %s", req.params.venueId, req.body.userId);
        res.status(400);
        return res.send("Failed to updateReview due to invalid venueId " + req.params.venueId + " or userId " + req.body.userId);
    }
    await Review.findOneAndUpdate(
    {venueId: req.params.venueId, userId: req.body.userId},
    {$set: {content: req.body.content, rating: req.body.rating}},
    function (err, updatedReview) {
        if (updatedReview) {
            console.log("Successfully updated review for venueId %s", req.params.venueId);
            return res.send(updatedReview);
        } else {
            console.log("Failed to updateReview for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to updateReview for venueId " + req.params.venueId);
        }
    })
};


// // function to add review
// const addReview = async (req, res) => {
//     if (!(ObjectId.isValid(req.body.userId) && ObjectId.isValid(req.body.venueId))) {
//         console.log("Failed to addReview due to invalid venueId %s or userId %s", req.body.venueId, req.body.userId);
//         res.status(400);
//         return res.send("Failed to addReview due to invalid venueId " + req.body.venueId + " or userId " + req.body.userId);
//     }
//     const checkExists = await Review.find({venueId: req.body.venueId, userId: req.body.userId});
//     const checkUserId = await User.find({_id: req.body.userId});
//     const checkVenueId = await Venue.find({_id: req.body.venueId});
//
//     if (!(checkUserId.length && checkVenueId.length)) {
//         console.log("Failed to addReview due to non-existing venueId %s or userId %s", req.body.venueId, req.body.userId);
//         res.status(400);
//         return res.send("Failed to addReview due to non-existing venueId " + req.body.venueId + " or userId " + req.body.userId);
//     } else if (checkExists.length) {
//         console.log("Review already exists for venueId %s and userId %s", req.body.venueId, req.body.userId, ", try updateReview instead");
//         return res.send("Review already exists for venueId " + req.body.venueId + " and userId " + req.body.userId + ", try updateReview instead");
//     } else {
//         const review = new Review({
//             venueId:req.body.venueId,
//             userId:req.body.userId,
//             datePosted:new Date(),
//             content:req.body.content,
//             rating:req.body.rating
//         });
//         await review.save(function (err, newReview) {
//             if (newReview) {
//                 console.log("Successfully added review");
//                 return res.send(newReview);
//             } else {
//                 console.log("Failed to addReview for venueId %s and userId %s", req.body.venueId, req.body.userId);
//                 res.status(400);
//                 return res.send("Failed to addReview for venueId " + req.body.venueId + " and userId " + req.body.userId);
//             }
//         })
//     }
// };

function convertReviews(reviewRaw) {

  if (reviewRaw.star1 === "on") {
    var rating = 1
  } else if (reviewRaw.star2 === "on") {
    var rating = 2
  } else if (reviewRaw.star3 === "on") {
    var rating = 3
  } else if (reviewRaw.star4 === "on") {
    var rating = 4
  } else {
    var rating = 5
  }

  const reviewProcessed = {
    venuedId: ObjectId(reviewRaw.venueId),
    userId: ObjectId(reviewRaw.userId),
    datePosted:new Date(),
    content: reviewRaw.review,
    rating: rating
  }
  return reviewProcessed;
}

// function to add review
const addReview = async (req, res) => {
  console.log(req.body)
  const reviewProcessed = convertReviews(req.body)
  console.log(reviewProcessed)
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
      return res.render('venueProfile', {
        venue: venue[0],
        user: req.user,
        completed: true
      });
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


// function to delete review by venue and user ID
const deleteReview = async (req, res) => {
    if (!(ObjectId.isValid(req.body.userId) && ObjectId.isValid(req.params.venueId))) {
        console.log("Failed to deleteReview due to invalid venueId %s or userId %s", req.params.venueId, req.body.userId);
        res.status(400);
        return res.send("Failed to deleteReview due to invalid venueId " + req.params.venueId + " or userId " + req.body.userId);
    }
    const review = await Review.find({venueId: req.params.venueId, userId: req.body.userId});
        await Review.deleteOne(
    {venueId: req.params.venueId, userId: req.body.userId},
    function() {
        if (review.length) {
            console.log("Successfully deleted review with venueId %s and userId %s", req.params.venueId, req.body.userId);
            return res.send("Successfully deleted review with venueId " + req.params.venueId);
        } else {
            console.log("Failed to deleteReview for venueId %s", req.params.venueId);
            res.status(400);
            return res.send("Failed to deleteReview for venueId " + req.params.venueId);
        }
    })
};


// export functions
module.exports = {
    getAllReviews,
    updateReview,
    addReview,
    getReviewByIDs,
    getReviewByVenueID,
    getReviewByUserID,
    deleteReview
};
