# Recipe Management App

A MERN application for saving and managing recipes. You can browse recipes as image cards, search by title, filter by cuisine or category, view full recipe details, and add, edit or delete recipes with an optional photo. Images are stored on Cloudinary, and recipe data is stored in MongoDB.

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express 5, MongoDB with Mongoose, Multer (memory storage), Cloudinary, dotenv

## Prerequisites

- Node.js
- MongoDB
- A Cloudinary account (free tier is enough) for image uploads

## Installation

```bash
cd server
npm install

cd ../client
npm install
```

## Running the App

Start the backend (port 5000):

```bash
cd server
npm run dev     # restarts on file changes
# or
npm start
```

Start the frontend (port 5173) in a second terminal:

```bash
cd client
npm run dev
```

### Running with Docker

```bash
docker compose up -d --build
```
