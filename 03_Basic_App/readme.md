# 03 Basic App - Notes API (In-Memory) 📝

This module builds a complete beginner-friendly CRUD API using Express and an in-memory array.

> Great for understanding flow first, before moving to MongoDB in the next module.

---

## 🎯 What You Learn

- How to structure a small backend with `server.js` and `src/app.js`
- How to handle JSON request bodies
- How CRUD APIs work end-to-end
- Why in-memory storage is useful for learning but limited for real apps

---

## 🧩 Build Sequence

### 1) Server Boot
- [server.js](server.js) imports [src/app.js](src/app.js)
- App starts on port 3000

### 2) Middleware Setup
- `express.json()` parses incoming JSON payloads

### 3) In-Memory Data Layer
- A `notes` array stores note objects temporarily
- Data resets whenever server restarts

### 4) CRUD Endpoints

| Method | Route | Purpose | Input |
|---|---|---|---|
| POST | /notes | Create note | `{ title, description }` |
| GET | /notes | Get all notes | none |
| DELETE | /notes/:index | Delete note by array index | `index` param |
| PATCH | /notes/:index | Update note description | `{ description }` |

### 5) Package Used
- **express**: Routing, middleware, and server lifecycle.

---

## ⚙️ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run server
```bash
node server.js
```

### 3. Test API
- http://localhost:3000/notes

---

## 📡 API Examples

### Create Note
```http
POST /notes
Content-Type: application/json

{
	"title": "Learn Express",
	"description": "Build first CRUD app"
}
```

### Update Note Description
```http
PATCH /notes/0
Content-Type: application/json

{
	"description": "Updated text"
}
```

---

## 🧠 Important Concepts

1. This module separates startup and app logic (`server.js` vs `app.js`).
2. Route params (`:index`) are dynamic URL parts.
3. In-memory storage is fast and simple, but not persistent.

---

## 🔐 Environment Variables

No environment variables are required in this module.

---

## ⚠️ Known Limitations

1. Index-based deletion/update can become inconsistent after deletions.
2. No validation for malformed body data.
3. No persistence across server restarts.
4. No centralized error handling.

