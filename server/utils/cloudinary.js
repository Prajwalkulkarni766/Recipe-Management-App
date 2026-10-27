const cloudinary = require('cloudinary').v2;

const RECIPE_FOLDER = 'recipe-management/recipes';

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function uploadImage(buffer) {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(
      createError('Image upload is not configured on the server. Please set the Cloudinary credentials.', 503)
    );
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: RECIPE_FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed:', error.message);
          return reject(createError('Image upload failed. Please try again.', 502));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

async function deleteImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;

  configureCloudinary();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    console.error(`Could not delete Cloudinary image ${publicId}:`, error.message);
  }
}

module.exports = { isCloudinaryConfigured, uploadImage, deleteImage };
