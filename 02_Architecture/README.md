# 02 Architecture - Express Foundation 🧱

This module shows the next step after a hello-world app: a cleaner and more intentional Express structure.

---

## 🎯 Learning Goals

- Understand how an Express app is initialized
- Understand route mapping with `app.get()`
- Build confidence with a tiny but structured backend

---

## 🧩 Build Sequence

### 1) Server Setup
- File: [server.js](server.js)
- Creates Express app instance.
- Starts server on port 3000.

### 2) Route Setup

| Method | Path | Purpose | Response |
|---|---|---|---|
| GET | / | Health/basic route | Hello World |
| GET | /home | Home route example | Home Page |

### 3) Package in Use
- **express**: Handles HTTP server creation, routing, and request/response lifecycle.

---

## ⚙️ Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start server
```bash
node server.js
```

### 3. Open routes
- http://localhost:3000/
- http://localhost:3000/home

---

## 🗂 Project Files

- [server.js](server.js): Main Express setup and route handlers
- [package.json](package.json): Dependency manifest
- [index.js](index.js): Additional starter file

---

## 🌱 Core Concepts

1. `const app = express()` creates the app object.
2. `app.get(path, handler)` binds endpoint logic.
3. `res.send()` sends response to client.
4. `app.listen(port)` starts accepting requests.

---

## 🔐 Environment Variables

No environment variables are required in this module.

