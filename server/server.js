require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { isCloudinaryConfigured } = require('./utils/cloudinary');

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Copy server/.env.example to server/.env and set it.');
    process.exit(1);
  }

  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary credentials are missing. Recipes can be saved, but image uploads will be rejected.');
  }

  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
