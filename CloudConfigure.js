
require('dotenv').config();

// Check if environment variables are loaded
console.log("DB_URL:", process.env.DB_URL);
console.log("SECRET:", process.env.SECRET);
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

// Cloudinary setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"]
  }
});

const wanderlust_DEV = multer({ storage });

module.exports = { cloudinary, storage };
