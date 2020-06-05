// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
//
// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   accessKeyID: process.env.AWS_ACCESS_KEY_ID,
//   region: "region=us-east-1"
// });
//
// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'studyspot',
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// });
//
// const singleUpload = upload.single('image');
//
// const venueImageUpload = async (req, res) => {
//   try {
//     console.log("SUCCESS");
//     console.log("req.files");
//     console.log(req.files);
//     // upload.single(req.files.venueImage)
//     // console.log("UPLOAD SUCCESS");
//     // return res.render('venueImage', {
//     //   completed: true
//     // });
//     console.log("req.files.venueImage");
//     console.log(req.files.venueImage);
//     // const venueImage = req.files.venueImage;
//     singleUpload(req, res, function(err){
//       console.log("UPLOAD SUCCESS");
//       console.log("req.files.location");
//       console.log(req.files.location);
//       return res.render('venueImage', {
//         completed: true
//       });
//     });
//   } catch(err) {
//     res.status(400);
//     console.log(err);
//     return res.render('error', {
//       error: "Database query failed",
//       message: "Database query failed",
//       functionfailure: "Failed to add venue image"
//     });
//   };
// };
//
// module.exports = {
//   venueImageUpload
// };
