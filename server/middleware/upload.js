const multer = require('multer');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const INVALID_TYPE_MESSAGE = 'Only JPEG, PNG and WebP images are allowed';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(req, file, callback) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      const error = new Error(INVALID_TYPE_MESSAGE);
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

function hasImageSignature(buffer) {
  if (buffer.length < 12) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';

  return isJpeg || isPng || isWebp;
}

function checkImageContent(req, res, next) {
  if (req.file && !hasImageSignature(req.file.buffer)) {
    return res.status(400).json({ success: false, message: INVALID_TYPE_MESSAGE });
  }
  next();
}

module.exports = [upload.single('image'), checkImageContent];
