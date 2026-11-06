const cloudinary = require("cloudinary").v2;

const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadImage = async (filePath) => {
  if (!useCloudinary) return null;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) =>
      error ? reject(error) : resolve(result.url)
    );
  });
};

module.exports = { useCloudinary, uploadImage };
