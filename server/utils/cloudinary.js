const cloudinary = require('cloudinary').v2;
const processEnv = require('../config/env');

const { cloudName, cloudApiKey, cloudApiSecret } = processEnv;
cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret
});

module.exports = cloudinary;