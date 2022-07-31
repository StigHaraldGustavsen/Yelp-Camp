const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDANARY_CLOUD_NAME,
    api_key: process.env.CLOUDANARY_KEY,
    api_secret: process.env.CLOUDANARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg','pnd','jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}