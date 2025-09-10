const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', 
    allowedFormats:["png","jpg","jpeg"],
    
  }
});
const wanderlust_DEV = multer({ storage });

module.exports = { cloudinary, storage };