# 06 Project-1 Post App

A full-stack Post App with image upload. Backend uses Express + MongoDB + ImageKit. Frontend uses React + Vite.

## Existing Code Process

1. Basic server creation (Backend)
- Backend/server.js loads app and DB connector.
- Starts server on port 3000.

2. MongoDB connection
- Backend/src/db/db.js connects using MONGO_URI.

3. Post model creation
- Backend/src/models/post.model.js stores:
  - fileId (ImageKit id)
  - image (public URL)
  - caption

4. Storage service
- Backend/src/services/storage.service.js uploads and deletes media via ImageKit.

5. API/router flow (defined directly in app.js)
- POST /create-post: upload image + caption.
- GET /posts: fetch all posts.
- DELETE /delete-post/:id: delete image and DB record.

6. Frontend flow
- Frontend/src/App.jsx handles routing.
- Feed page reads posts.
- Create page sends multipart form data to backend.

## Essential Packages and Purpose

### Backend
1. express
- HTTP server and APIs.

2. mongoose
- MongoDB schema/model and CRUD.

3. multer
- Parses multipart file uploads.

4. @imagekit/nodejs and imagekit
- Upload/delete files in cloud storage.

5. cors
- Allows frontend to call backend from another origin.

6. dotenv
- Loads environment variables.

### Frontend
1. react and react-dom
- UI rendering.

2. react-router-dom
- Client-side routing.

3. axios
- API requests.

4. vite
- Development/build tooling.

## Environment Setup

Create Backend/.env:

MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

## API Reference (Backend)

1. Create post
- Method: POST
- Path: /create-post
- Content-Type: multipart/form-data
- Fields: image (file), caption (text)

2. Get all posts
- Method: GET
- Path: /posts

3. Delete post
- Method: DELETE
- Path: /delete-post/:id
- id expects ImageKit fileId in current implementation

## Run Instructions

1. Backend setup
- cd Backend
- npm install
- npm run dev or node server.js

2. Frontend setup
- cd Frontend
- npm install
- npm run dev

3. Open frontend
- http://localhost:5173

## Folder Map

- Backend/server.js: Backend boot
- Backend/src/app.js: API logic
- Backend/src/db/db.js: DB connection
- Backend/src/models/post.model.js: Post model
- Backend/src/services/storage.service.js: ImageKit integration
- Frontend/src/App.jsx: Main frontend routing
- Frontend/src/pages/CreatePost.jsx: Post upload page

## Notes

1. In CreatePost page, API URL currently uses //localhost:3000/create-post. Prefer http://localhost:3000/create-post explicitly.
2. Add validation and centralized error middleware for production use.
