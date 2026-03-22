const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); 

//tell multer to use cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: 'recipenest', //folder in cloudinary to store images
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }] //resize images to max 800x600
    }
});

//file size limit + type check
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }   
    }
});

module.exports = upload;