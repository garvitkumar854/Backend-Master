# 01 Basic - Express Starter 🚀

This module is the first step of your backend journey.
It teaches how to create a basic Express server and expose simple routes.

---

## 🎯 What You Learn

- How to create an Express app
- How to define GET routes
- How to run a Node server locally
- How request and response work in a minimal API

---

## 🧩 Existing Code Process

### 1. Server Creation
- Main file: [server.js](server.js)
- Creates Express app instance.
- Starts server on port 3000.

### 2. Route Creation
Two routes are defined:

| Method | Route | Response |
|---|---|---|
| GET | / | Hello World |
| GET | /about | About Page |

### 3. Package Used
- express: Web framework for server and routing.

---

## ⚙️ Setup and Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start server
```bash
node server.js
```

### 3. Test in browser or Postman
- http://localhost:3000/
- http://localhost:3000/about

---

## 🗂 Folder Contents

- [server.js](server.js): Express server and route definitions
- [package.json](package.json): Project metadata and dependencies
- [index.js](index.js): Extra starter file

---

## 🌱 Important Concept Notes

1. Express app is your HTTP server object.
2. app.get(path, handler) maps a URL to code logic.
3. res.send() sends response text to the client.
4. app.listen(port) starts accepting incoming requests.

---

## 🔐 Environment Variables

No environment variables are required in this module.

---

## ✅ Quick Validation Checklist

- Server starts without error
- Route / returns Hello World
- Route /about returns About Page
