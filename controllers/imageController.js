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
      return res.render('venueImageUpload', {
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
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }

  if (req.user == null){
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to upload a venue photo"
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
          return res.render("venueImageUpload",{
            venue: result,
            completed: true
          });
        });
    });

};

const getUserAvatarImagePage = async (req, res) => {
  if (ObjectId.isValid(req.params._id) === false || req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to change your avatar"
    });
  }

  if (req.user._id.toString() != req.params._id){
    return res.render('error', {
      error: "You can only change your own avatar",
      message: "You can only change your own avatar"
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

    if (req.user._id.toString() != req.params._id){
      return res.render('error', {
        error: "You can only delete your own avatar",
        message: "You can only delete your own avatar"
      });
    }

    // Binary data base64
    const fileContent  = Buffer.from(req.files.userAvatar.data, 'binary');

    const imageKey = "user/avatar/" + req.user._id.toString() + ".jpg"

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
  var imageLinks = [];
  var i = 0;
  while (i < images.length){
    imageLinks.push(images[i].Key);
    i += 1;
  }

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
      var params = {
        Bucket: 'studyspot',
        Delimiter: '',
        Prefix: prefix
      }
      s3.listObjects(params, function (err, data) {
        if(err){
            return res.render('error', {
              error: "Database query failed",
              message: "Failed to get venue gallery.",
              imageerror: "To return to the venue profile page, ",
              venueId: req.params._id
            });
        } else {
        imageLinks = extractURL(data.Contents);
        return res.render('venueGallery', {
          venue: venue[0],
          currentUser: req.user,
          galleryImages: imageLinks
          });
        }
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
  if (ObjectId.isValid(req.params._id) === false) {
    return res.render('error', {
      error: "There are no venues listed with this id!",
      message: "There are no venues listed with this id!",
      venueerror: "For a list of all registered venues,"
    });
  }
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

const deleteVenueImage = async (req, res) => {
  console.log("SUCCESS");
  const imagePath = req.body.imagePath
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
      message: "You must be an admin to delete a venue photo."
    });
  }
  if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admim!",
      message: "You must be an admin to delete a venue photo"
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
      // Setting up S3 upload parameters
      const params = {
          Bucket: 'studyspot',
          Key: imagePath // File name you want to delete
      };

      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err);
          return res.render('error', {
            error: "Database query failed",
            message: "Failed to delete image.",
            imageerror: "To return to the venue gallery, ",
            venueId: req.params._id
          });
        } else {
          console.log("DELETED");

          const prefix = "venue/fromUsers/" + req.params._id.toString();
          var params = {
            Bucket: 'studyspot',
            Delimiter: '',
            Prefix: prefix
          }
          s3.listObjects(params, function (err, data) {
            if(err)throw err;
            imageLinks = extractURL(data.Contents);
            return res.render('venueGallery', {
              venue: venue[0],
              currentUser: req.user,
              galleryImages: imageLinks,
              deleted: true

            });
          });
        }
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

const getDeleteVenueHeaderPage = async (req, res) => {
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
      message: "You must be an admin to delete a venue header"
    });
  }
  if (req.admin == false) {
    return res.render('error', {
      error: "You're not an adin!",
      message: "You must be an admin to delete a venue header"
    });
  }
  console.log("USER FOUND");
  try {
    const venue = await Venue.find({_id: req.params._id});
    if (venue.length === 0){
      return res.render('error', {
        error: "There are no venues listed with this id!",
        message: "There are no venues listed with this id!",
        venueerror: "For a list of all registered venues,"
      });
    } else {
      console.log("USER FOUND");
      const prefix = "venue/header/" + req.params._id.toString();
      var params = {
        Bucket: 'studyspot',
        Delimiter: '',
        Prefix: prefix
      }

      s3.listObjects(params, function (err, data) {
        if(err){
          return res.render('error', {
            error: "Database query failed",
            message: "Failed to get delete header page.",
            imageerror: "To return to the venue profile page,"
          });
        } else {
          imageLink = extractURL(data.Contents);
          return res.render('venueHeaderDelete', {
            header: imageLink,
            venue: venue[0]
          });
        }
      });

    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get 'delete venue header' page"
    });
  }
};

const deleteVenueHeader = async (req, res) => {
  console.log("SUCCESS");
  const headerPath = "venue/header/" + req.params._id.toString() + ".jpg"
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
      message: "You must be an admin to delete a venue header."
    });
  }
  if (req.user.admin == false) {
    return res.render('error', {
      error: "You're not an admim!",
      message: "You must be an admin to delete a venue header"
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
      // Setting up S3 upload parameters
      const params = {
          Bucket: 'studyspot',
          Key: headerPath // File name you want to delete
      };

      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err);
          return res.render('error', {
            error: "Database query failed",
            message: "Failed to delete header image.",
            imageerror: "To return to the venue gallery, ",
            venueId: req.params._id
          });
        } else {
          console.log("DELETE SUCCESS");
          return res.render('venueHeaderDelete', {
            venue: venue[0],
            currentUser: req.user,
            deleted: true
          });
        }
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get delete venue header"
    });
  }
};


const getdeleteUserAvatarImagePage = async (req, res) => {

    if (ObjectId.isValid(req.params._id) === false || req.user == null) {
      return res.render('error', {
        error: "You're not logged in!",
        message: "You must be logged in to change your avatar"
      });
    }

    if (req.user._id.toString() != req.params._id){
      return res.render('error', {
        error: "You can only delete your own avatar",
        message: "You can only delete your own avatar"
      });
    }

    const prefix = "user/avatar/" + req.params._id.toString();
    var params = {
      Bucket: 'studyspot',
      Delimiter: '',
      Prefix: prefix
    }

    s3.listObjects(params, function (err, data) {
      if(err){
        return res.render('error', {
          error: "Database query failed",
          message: "Failed to get delete avatar page.",
          functionfailure: "Failed to get delete avatar page"
        });
      } else {
        imageLink = extractURL(data.Contents);
        return res.render('userAvatarDelete', {
          avatar: imageLink,
          user: req.user
        });
      }
    });

};

const deleteUserAvatar = async (req, res) => {
  console.log("SUCCESS");
  const avatarPath = "user/avatar/" + req.params._id.toString() + ".jpg"

  if (ObjectId.isValid(req.params._id) === false || req.user == null) {
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to change your avatar"
    });
  }

  if (req.user._id.toString() != req.params._id){
    return res.render('error', {
      error: "You can only delete your own avatar",
      message: "You can only delete your own avatar"
    });
  }

  try {
    const user = await User.find({_id: req.params._id});
    if (user.length === 0){
      return res.render('error', {
        error: "There are no users listed with this id!",
        message: "There are no users listed with this id!",
      });
    } else {
      // Setting up S3 upload parameters
      const params = {
          Bucket: 'studyspot',
          Key: avatarPath // File name you want to delete
      };

      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err);
          return res.render('error', {
            error: "Database query failed",
            message: "Failed to delete avatar image.",
            avatarerror: "To return to your profile,"
          });
        } else {
          console.log("DELETE SUCCESS");
          return res.render('userAvatarDelete', {
            deleted: true
          });
        }
      });
    }
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: "Database query failed",
      message: "Database query failed",
      functionfailure: "Failed to get delete venue header"
    });
  }
};


// export functions
module.exports = {
      getVenueImagePage,
      uploadVenueImage,
      getUserAvatarImagePage,
      uploadUserAvatarImage,
      getVenueGalleryPage,
      getVenueHeaderPage,
      uploadVenueHeaderImage,
      deleteVenueImage,
      getDeleteVenueHeaderPage,
      deleteVenueHeader,
      getdeleteUserAvatarImagePage,
      deleteUserAvatar
};
