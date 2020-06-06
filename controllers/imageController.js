const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Venue = mongoose.model("venue");
const User = mongoose.model("user");

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
  secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
  region: "us-east-1" //Region
});

const getVenueImagePage = async (req, res) => {
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
      message: "You must be logged in to upload a venue photo"
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
      return res.render('venueImage', {
        venue: venue[0],
        user: user
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get 'upload venue image' page"
    });
  }
};

const uploadVenueImage = async (req, res) => {

  if (req.user == null){
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to submit a suggestion"
    });
  }
    // Binary data base64
    const fileContent  = Buffer.from(req.files.venueImage.data, 'binary');

    const date = new Date();
    const dateInfo = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
    + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();

    var fileType = "." + (req.files.venueImage.mimetype).slice(6)

    const imageKey = "venue/fromUsers/" + req.params._id.toString() + "/" + req.user._id.toString() + dateInfo + fileType

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'studyspot',
        Key: imageKey, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
            return res.render('error', {
              error: "Database query failed",
              message: "Failed to upload image.",
              imageerror: "To return to the venue profile page, ",
              venueId: req.params._id
            });
        }
        const venue = Venue.findById(req.params._id);
        venue.then(function(result){
          res.status(200);
          return res.render("venueImage",{
            venue: result,
            completed: true
          });
        });
    });

};

const getUserAvatarImagePage = async (req, res) => {
  console.log("s3");
  console.log(s3);
  if (ObjectId.isValid(req.params._id) === false || req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to change your avatar"
    });
  }
  const user = await User.findById(req.user._id);
  try {
    if (user == null){
      return res.render('error', {
        error: "You're not logged in!",
        message: "You must be logged in to change your avatar"
      });
    } else {
      return res.render('userAvatar', {
        user: user
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get 'upload avatar' page"
    });
  }
};

const uploadUserAvatarImage = async (req, res) => {
  if (req.user == null){
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to upload an avatar."
    });
  }

    // Binary data base64
    const fileContent  = Buffer.from(req.files.userAvatar.data, 'binary');
    console.log("fileContent");
    console.log(fileContent);

    const imageKey = "user/avatar/" + req.user._id.toString() + ".jpg"
    console.log("imageKey");
    console.log(imageKey);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'studyspot',
        Key: imageKey, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
            return res.render('error', {
              error: "Database query failed",
              message: "Failed to upload image.",
              avatarerror: "To return to your profile page, ",
            });
        } else{
          res.status(200);
          return res.render("userAvatar",{
            user: req.user,
            completed: true
          });
        }
    });

};

function extractURL(images) {
  console.log("images");
  console.log(images);
  var imageLinks = [];
  var i = 0;
  while (i < images.length){
    console.log("images[i]");
    console.log(images[i]);
    console.log("image[i].Key");
    console.log(images[i].Key);
    imageLinks.push(images[i].Key);
    i += 1;
  }

  console.log(imageLinks)

  return imageLinks;
}


const getVenueGalleryPage = async (req, res) => {
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
      const prefix = "venue/fromUsers/" + req.params._id.toString();
      console.log("prefix");
      console.log(prefix);
      var params = {
        Bucket: 'studyspot',
        Delimiter: '',
        Prefix: prefix
      }
      s3.listObjects(params, function (err, data) {
        if(err)throw err;
        console.log("DATA");
        console.log(data.Contents);
        imageLinks = extractURL(data.Contents);
        console.log(imageLinks);
        return res.render('venueGallery', {
          venue: venue[0],
          currentUser: req.user,
          galleryImages: imageLinks
        });
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get 'venue gallery' page"
    });
  }
};

const getVenueHeaderPage = async (req, res) => {
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
      message: "You must be an admin to upload a venue header"
    });
  }
  if (req.admin == false) {
    return res.render('error', {
      error: "You're not an adin!",
      message: "You must be an admin to upload a venue header"
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
      return res.render('venueHeader', {
        venue: venue[0],
        user: user
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get 'upload venue header' page"
    });
  }
};


const uploadVenueHeaderImage = async (req, res) => {

  if (req.user == null){
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be an admin to upload a venue header."
    });
  }

  if (req.user.admin == false){
    return res.render('error', {
      error: "You're not an admin!",
      message: "You must be an admin to upload a venue header."
    });
  }

    // Binary data base64
    const fileContent  = Buffer.from(req.files.venueHeader.data, 'binary');

    const imageKey = "venue/header/" + req.params._id.toString() + ".jpg"

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'studyspot',
        Key: imageKey, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
            return res.render('error', {
              error: "Database query failed",
              message: "Failed to upload image.",
              imageerror: "To return to the venue profile page, ",
              venueId: req.params._id
            });
        }
        const venue = Venue.findById(req.params._id);
        venue.then(function(result){
          res.status(200);
          return res.render("venueHeader",{
            venue: result,
            completed: true
          });
        });
    });

};



// export functions
module.exports = {
      getVenueImagePage,
      uploadVenueImage,
      getUserAvatarImagePage,
      uploadUserAvatarImage,
      getVenueGalleryPage,
      getVenueHeaderPage,
      uploadVenueHeaderImage
};
