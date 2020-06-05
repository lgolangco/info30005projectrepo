const mongoose = require('mongoose');
const Venue = mongoose.model("venue");

const AWS = require('aws-sdk');

const uploadVenueImage = async (req, res) => {

  if (req.user == null){
    return res.render('error', {
      error: "You're not logged in!",
      message: "You must be logged in to submit a suggestion"
    });
  }
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
      secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
      region: "us-east-1" //Region
    });

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

// export functions
module.exports = {
    uploadVenueImage,
};
