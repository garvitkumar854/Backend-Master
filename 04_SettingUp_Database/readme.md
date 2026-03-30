# 04 Setting Up Database - Notes API with MongoDB

This module upgrades the previous Notes app from in-memory storage to MongoDB persistence using Mongoose.

## Existing Code Process

1. Basic server creation
- server.js imports app and DB connector.
- connectDB() is called before starting server on port 3000.

2. MongoDB database connection
- src/db/db.js uses mongoose.connect().
- Connection string is currently a placeholder and should be replaced.

3. Note model creation
- src/models/note.model.js defines noteSchema with title and description.
- Model name: Note.

4. API creation
- src/app.js defines Notes CRUD APIs using noteModel.
- POST /notes: create note in DB.
- GET /notes: fetch all notes.
- DELETE /notes/:id: delete by ObjectId.
- PATCH /notes/:id: update description.

5. Essential package installation and purpose
- express: Server and route handling.
- mongoose: MongoDB connection, schema, model, CRUD helpers.

## Environment Setup

Create a .env file in this folder and define:

MONGO_URI=your_mongodb_connection_string

Then update src/db/db.js to read process.env.MONGO_URI instead of a hardcoded placeholder.

## API Reference

1. Create note
- Method: POST
- Path: /notes
- Body: { "title": "...", "description": "..." }

2. Get all notes
- Method: GET
- Path: /notes

3. Delete note
- Method: DELETE
- Path: /notes/:id

4. Update note
- Method: PATCH
- Path: /notes/:id
- Body: { "description": "..." }

## Setup

1. Install dependencies
- npm install

2. Configure MongoDB
- Add MONGO_URI in .env

3. Run server
- node server.js

## Folder Structure

- server.js: Starts server
- src/app.js: Middleware + routes
- src/db/db.js: Database connection
- src/models/note.model.js: Note schema/model

## Improvement Suggestions

1. Add try/catch in controllers.
2. Add request validation.
3. Add required fields and timestamps in schema.
4. Move port to env variable.
