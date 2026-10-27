const multer = require('multer');
const mongoose = require('mongoose');

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function getErrorResponse(err) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return { status: 413, message: 'Image must be 5 MB or smaller' };
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return { status: 400, message: 'Only one image can be uploaded, using the "image" field' };
    }
    return { status: 400, message: 'Invalid file upload' };
  }

  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'Malformed request body' };
  }

  if (err.type === 'entity.too.large') {
    return { status: 413, message: 'Request body is too large' };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
    return { status: 400, message };
  }

  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, message: `Invalid value for ${err.path}` };
  }

  if (err.status) {
    return { status: err.status, message: err.message };
  }

  return { status: 500, message: 'Something went wrong. Please try again later.' };
}

function errorHandler(err, req, res, next) {
  const { status, message } = getErrorResponse(err);

  if (status >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
