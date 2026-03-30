# 04 Setting Up Database - Notes API with MongoDB 🍃

This module upgrades the previous in-memory Notes API to a persistent MongoDB-backed API using Mongoose.

---

## 🎯 What You Learn

- How to connect Express with MongoDB
- How to define schemas and models using Mongoose
- How CRUD changes when data is stored in database
- Why ObjectId-based APIs are better than index-based APIs

---

## 🧩 Build Sequence

### 1) Server Boot
- [server.js](server.js) imports app and DB connector
- Calls `connectDB()` and starts server on port 3000

### 2) Database Connection Layer
- [src/db/db.js](src/db/db.js) uses `mongoose.connect()`
- Currently uses placeholder connection string and should be env-driven

### 3) Model Layer
- [src/models/note.model.js](src/models/note.model.js)
- Defines note schema with `title` and `description`
- Exports `noteModel` for CRUD operations

### 4) API Layer
- [src/app.js](src/app.js) defines all notes routes

| Method | Route | Purpose | Input |
|---|---|---|---|
| POST | /notes | Create note | `{ title, description }` |
| GET | /notes | Get all notes | none |
| DELETE | /notes/:id | Delete note by Mongo ObjectId | `id` param |
| PATCH | /notes/:id | Update note description | `{ description }` |

### 5) Packages and Purpose
- **express**: API server + middleware + routes
- **mongoose**: MongoDB connection, schema, and DB methods

---

## 🌍 Environment Setup

Create a `.env` file in this folder:

```env
MONGO_URI=your_mongodb_connection_string
```

Then use `process.env.MONGO_URI` in [src/db/db.js](src/db/db.js).

---

## ⚙️ Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure MongoDB URI
- Add `MONGO_URI` in `.env`

### 3. Start server
```bash
node server.js
```

---

## 🗂 Folder Structure

- [server.js](server.js): Entry point
- [src/app.js](src/app.js): Middleware and routes
- [src/db/db.js](src/db/db.js): DB connection logic
- [src/models/note.model.js](src/models/note.model.js): Schema and model

---

## 🧠 Important Concepts

1. `mongoose.Schema` defines field structure for documents.
2. `mongoose.model` creates reusable DB interface methods.
3. `findByIdAndDelete` and `findOneAndUpdate` operate using Mongo ObjectIds.
4. Database-backed APIs keep data after restart.

---

## 🚀 Recommended Improvements

1. Add try/catch and proper error responses in all handlers.
2. Add validation for missing/invalid body fields.
3. Add schema constraints like `required`, `trim`, and timestamps.
4. Move port and DB configs fully to env.
5. Split routes/controllers/services for cleaner architecture.

