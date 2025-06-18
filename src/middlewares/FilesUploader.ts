//import multer from "multer";
//import multerS3 from "multer-s3";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadUserPhoto = ({
 
});
/*multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || "indusviaggiapi-user-photos",
    acl: "public-read", // or "private" if you want restricted access
    key: function (req, file, cb) {
      cb(null, `users/${Date.now()}-${file.originalname}`);
    },
  }),
});*/