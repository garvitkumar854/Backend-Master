# 03 Basic App - Notes API (In-Memory)

This module builds a simple Notes CRUD API using Express and in-memory array storage.

## Existing Code Process

1. Basic server creation
- server.js imports src/app.js and starts server on port 3000.

2. App and middleware setup
- src/app.js creates Express app.
- express.json() is added to parse request body JSON.

3. Notes data structure
- Uses notes array in memory.
- Data is lost after server restart.

4. Router/API creation inside app
- POST /notes: create a note.
- GET /notes: fetch all notes.
- DELETE /notes/:index: delete note by index.
- PATCH /notes/:index: update note description by index.

5. Packages installation and purpose
- express: HTTP server, middleware, route handling.

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
- Path: /notes/:index

4. Update note description
- Method: PATCH
- Path: /notes/:index
- Body: { "description": "..." }

## Setup

1. Install packages
- npm install

2. Run server
- node server.js

3. Test base
- http://localhost:3000/notes

## Environment Variables

No environment variables are used in this folder.

## Known Limitations

1. Using array index for update/delete is fragile after deletions.
2. No input validation.
3. No persistent database.
