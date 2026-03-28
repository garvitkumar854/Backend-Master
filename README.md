# Backend Master - Node.js Learning & Projects

A comprehensive backend development repository showcasing Node.js and Express.js fundamentals, architecture patterns, and full-stack project implementations. Learn industry best practices through progressive, hands-on projects.

---

## 🚀 What You'll Learn

| Concept | Project | Description |
|---------|---------|-------------|
| **Node.js Basics** | 01_Basic | Create HTTP servers without frameworks |
| **Architecture** | 02_Architecture | Organize code for maintainability |
| **Express.js** | 03_Basic_App | Build web applications with Express |
| **Databases** | 04_SettingUp_Database | Connect and interact with MongoDB |
| **CRUD Operations** | 05_Practice | Create, Read, Update, Delete patterns |
| **Full Stack App** | 06_Project-1-Post-App | Complete social media backend + frontend |
| **Authentication** | 07_Authentication | User login, JWT tokens, session management |
| **Authorization & OAuth** | 08_Spotify-Authentication | Role-based access, music streaming API |

---

## 📁 Project Structure & Descriptions

### 🔵 Phase 1: Fundamentals

#### **01_Basic/** - Node.js Server Basics
**What you'll learn:**
- Create HTTP servers using Node.js core modules
- Handle requests and send responses
- Basic routing and request parsing
- Port binding and server listening

**Key files:** `index.js`, `server.js`

#### **02_Architecture/** - Backend Architecture Principles
**What you'll learn:**
- Organize code into logical modules
- Separation of concerns (Controllers, Routes, Models)
- Scalable project structure
- Best practices for maintainability

**Key files:** `index.js`, `server.js`

#### **03_Basic_App/** - Express.js Introduction
**What you'll learn:**
- Express.js framework basics
- Middleware functionality and usage
- Request/response handling
- Static file serving
- Error handling basics

**Files:** `src/app.js`, `server.js`

---

### 🟡 Phase 2: Database Integration

#### **04_SettingUp_Database/** - MongoDB Connection & Setup
**What you'll learn:**
- MongoDB connection (local or cloud)
- Mongoose schema creation
- Model definition and validation
- Basic CRUD operations
- Database error handling

**Files:**
- `src/db/db.js` - Database connection
- `src/models/note.model.js` - Schema definition

#### **05_Practice/** - Database Practice Exercises
**What you'll learn:**
- Implementing all CRUD operations
- Working with multiple models
- Relationships between collections
- Query techniques
- Data validation

**Files:**
- `src/db/db.js` - Connection setup
- `src/models/note.model.js` - Model structure
- `src/app.js` - CRUD endpoints

---

### 🟢 Phase 3: Full-Stack Projects

#### **06_Project-1-Post-App/** - Social Media Post Application
**What you'll learn:**
- File upload handling (Multer)
- Cloud storage integration (ImageKit)
- RESTful API design
- Frontend-backend integration
- CORS handling
- Multi-part form data

**Backend Features:**
- `/create-post` - Upload post with image
- `/posts` - Retrieve all posts
- `/delete-post/:id` - Delete post and image

**Backend Files:** (All with comprehensive learning comments)
- `src/app.js` - API endpoints with detailed comments
- `src/models/post.model.js` - Post schema
- `src/services/storage.service.js` - ImageKit integration
- `src/db/db.js` - MongoDB connection

**Frontend Features (React + Vite):**
- Post feed display
- Create post form
- Delete functionality
- Navigation components

---

### 🟣 Phase 4: Authentication & Authorization

#### **07_Authentication/** - User Authentication System
**What you'll learn:**
- User registration and login
- Password hashing (bcryptjs)
- JWT token generation
- Token verification
- Secure cookie handling
- Protected routes
- User sessions

**Files:**
- `src/controllers/auth.controller.js` - Register, Login, Logout
- `src/models/user.model.js` - User schema
- `src/routes/auth.routes.js` - Auth endpoints
- `src/routes/post.routes.js` - User's posts

---

#### **08_Spotify-Authentication/** - OAuth & Role-Based Authorization
**What you'll learn:**
- Two-user system (User vs Artist)
- Role-Based Access Control (RBAC)
- Middleware for authentication checks
- Middleware for authorization checks
- Token verification and decoding
- File upload to cloud storage
- MongoDB relationships and population
- Album and music management

**User Roles:**
- **User**: Can listen/view music, browse albums
- **Artist**: Can upload music, create albums, do everything users can do

**Advanced Files with Learning Comments:**
- `src/app.js` - Express application setup
- `src/controllers/auth.controller.js` - Register, Login with role handling
- `src/controllers/music.controller.js` - Create music/albums, retrieve data
- `src/middlewares/auth.middleware.js` - Authentication & authorization checks
- `src/models/user.model.js` - User schema with role enum
- `src/models/music.model.js` - Music schema with artist reference
- `src/models/album.model.js` - Album schema with music array
- `src/routes/auth.routes.js` - Authentication endpoints
- `src/routes/music.routes.js` - Protected music endpoints
- `src/services/storage.service.js` - ImageKit cloud upload

**Key Concepts:**
- JWT tokens with payload (id, role)
- Middleware chain execution
- Role-based route protection
- Populate and references in Mongoose
- Multer with file upload

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript server runtime |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB | NoSQL database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Frontend** | React | UI library |
| **Build Tool** | Vite | Fast frontend build tool |
| **Authentication** | JWT | Secure token-based authentication |
| **Password** | bcryptjs | Secure password hashing |
| **File Upload** | Multer | Middleware for file handling |
| **Cloud Storage** | ImageKit | Cloud image/file hosting |
| **CORS** | CORS | Cross-origin resource sharing |
| **Env Vars** | dotenv | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or yarn - Comes with Node.js
- **MongoDB** - [Local](https://www.mongodb.com/try/download/community) or [Cloud Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - For version control
- **Code Editor** - VS Code recommended

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Backend-Master
```

#### 2. Navigate to Project
```bash
# For basic project
cd 01_Basic

# OR for specific project
cd 06_Project-1-Post-App/Backend
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Environment Variables
```bash
# Create .env file
touch .env      # Mac/Linux
# or
echo.> .env     # Windows

# Add required variables (see project readme)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project-name
```

#### 5. Start Server
```bash
npm start
# or
npm run dev     # with nodemon (auto-restart)
```

---

## 📚 Learning Path (Recommended Order)

### Week 1: Foundations
1. **01_Basic** - Understand how Node.js servers work
2. **02_Architecture** - Structure your code properly
3. **03_Basic_App** - Master Express.js basics

### Week 2: Databases
4. **04_SettingUp_Database** - Connect to MongoDB
5. **05_Practice** - Get comfortable with CRUD

### Week 3: Real Projects
6. **06_Project-1-Post-App** - Build a social media feature
7. **Review**: Solidify week 1-3 concepts

### Week 4: Advanced
8. **07_Authentication** - Add user system
9. **Review**: Test end-to-end functionality

### Week 5: Mastery
10. **08_Spotify-Authentication** - Advanced authorization
11. **Combine**: Merge concepts from all projects

---

## 📝 Key Concepts by Project

### HTTP & Servers
- Request/Response cycle
- Status codes (200, 404, 500, etc.)
- Headers and body
- Routing

### Express.js
- Middleware functions
- Request handlers
- Route parameters
- Query strings
- Error handling

### MongoDB & Mongoose
- Collections and documents
- Schema definition
- Validation rules
- CRUD operations
- Relationships (references, arrays)
- Population (joins)

### Authentication & Security
- Password hashing (bcryptjs)
- JWT tokens
- Cookies (HTTP-only)
- Role-based access
- Middleware authorization

### File Handling
- Multer middleware
- Memory storage
- Base64 encoding
- Cloud storage integration
- File deletion

---

## 🔒 Environment Variables Reference

```env
# Server Configuration
NODE_ENV=development          # development or production
PORT=3000                     # Server port

# Database Configuration
MONGO_URI=mongodb://localhost:27017/dbname
# Cloud: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_secret_key_min_32_chars_long
BCRYPT_SALT_ROUNDS=10

# ImageKit (Cloud Storage)
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Common npm Scripts

```bash
# Start server
npm start                    # Production
npm run dev                 # Development with auto-reload

# Database
npm run db:migrate          # Run migrations (if configured)
npm run db:seed             # Populate test data (if configured)

# Code Quality
npm run lint                # ESLint
npm run format              # Prettier
npm test                    # Run tests

# Build
npm run build               # Build for production
```

---

## 🧪 Testing Your Project

### Manual Testing with Postman/Insomnia

#### Register User
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "user"
}
```

#### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "Password123!"
}
```

#### Get Protected Data
```
GET http://localhost:3000/api/music
Cookie: token=<JWT_TOKEN_FROM_LOGIN>
```

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Find process using port 3000
lsof -i :3000              # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>
```

### "Cannot connect to MongoDB"
- Verify MongoDB is running: `mongosh` or `mongo`
- Check connection string in .env
- Ensure MONGO_URI is correct for your setup

### "CORS Error"
- Install CORS: `npm install cors`
- Add `const cors = require('cors');` and `app.use(cors());`
- Configure specific origins if needed

### "Token undefined in cookies"
- Check if cookie-parser is installed
- Verify `app.use(cookieParser())` in app.js
- Ensure frontend sends cookies with requests

---

## 📚 Additional Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [ImageKit](https://imagekit.io/docs/)

### Learning Guides
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Best Practices](https://restfulapi.net/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## 💡 Pro Tips for Learning

1. **Read the Comments**: Each file has detailed learning comments explaining concepts
2. **Modify Code**: Change values, add fields, experiment with endpoints
3. **Use Console Logs**: Add `console.log()` to understand data flow
4. **Test APIs**: Use Postman to test every endpoint
5. **Break It**: Try to break things, then fix them - best learning method
6. **Document**: Write notes as you learn for future reference
7. **Connect Projects**: Try combining features from different projects
8. **Type Safety**: Experiment with TypeScript for larger projects

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/learning-material`)
3. Add improvements or new projects
4. Commit changes (`git commit -m 'Add new learning module'`)
5. Push to branch (`git push origin feature/learning-material`)
6. Create Pull Request

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 👤 Author

Created for learning Node.js and Express.js backend development.

### Supported by:
- Comprehensive comments in source code
- Step-by-step project structure
- Real-world application examples
- Educational READMEs for each project

---

## 🎉 Getting Help

- Read project-specific `readme.md` files for detailed instructions
- Check inline comments in source files for explanations
- Review error messages carefully - they often suggest solutions
- Test with Postman/Insomnia before frontend integration

---

## ✅ Checklist Before Moving to Next Project

- [ ] Code runs without errors
- [ ] All endpoints tested in Postman
- [ ] Understand each file's purpose
- [ ] Can explain the project to someone else
- [ ] Modified code to experiment and learn
- [ ] Read all inline comments and documentation

---

**Happy Learning! 🚀** Continue building and experimenting. Each project builds on previous concepts.

*Last Updated: 2026*
