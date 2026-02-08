# Backend Master - Node.js Learning & Projects

A comprehensive backend development repository showcasing Node.js and Express.js fundamentals, architecture patterns, and full-stack project implementations.

## 📁 Project Structure

### Foundational Modules

- **01_Basic/** - Introduction to Node.js and basic server setup
  - Simple HTTP server creation
  - Basic routing and request handling

- **02_Architecture/** - Backend architecture principles
  - Separation of concerns
  - Scalable project structure

- **03_Basic_App/** - Introductory Express.js application
  - Express fundamentals
  - Basic routing and middleware

### Database Integration

- **04_SettingUp_Database/** - Database configuration and setup
  - MongoDB/Database connection setup
  - Basic schema and models

- **05_Practice/** - Practice exercises with database
  - CRUD operations
  - Model relationships

### Full-Stack Projects

- **06_Project-1-Post-App/** - Complete post/blog application
  - **Backend**: Express.js server with MongoDB
    - Post model and database operations
    - File storage service
    - RESTful API endpoints
  - **Frontend**: React + Vite
    - Post feed display
    - Create post functionality
    - Navbar component

- **07_Authentication/** - User authentication system
  - User model and database
  - Authentication routes and controllers
  - JWT/session management
  - Post routes with user association

- **08_Spotify-Authentication/** - OAuth integration example
  - Spotify API authentication
  - User and music models
  - Music routes and controllers
  - Storage service implementation
  - Multi-platform auth controller

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database-dependent projects)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend-Master
```

2. Navigate to a specific project:
```bash
cd 01_Basic
# or
cd 06_Project-1-Post-App/Backend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
# Create a .env file
cp .env.example .env
# Add your configuration
```

5. Start the server:
```bash
npm start
# or
npm run dev
```

## 📚 Learning Path

Follow this recommended progression:

1. Start with `01_Basic` to understand Node.js fundamentals
2. Move to `02_Architecture` to learn proper project structure
3. Explore `03_Basic_App` for Express.js basics
4. Learn database integration with `04_SettingUp_Database`
5. Practice with `05_Practice` exercises
6. Build a complete app with `06_Project-1-Post-App`
7. Add authentication with `07_Authentication`
8. Implement OAuth with `08_Spotify-Authentication`

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: React, Vite
- **Authentication**: JWT, OAuth 2.0 (Spotify)
- **Tools**: ESLint, Vite

## 📝 Key Features

- RESTful API design
- Database modeling and relationships
- Authentication and authorization
- Third-party OAuth integration
- File storage and management
- Separation of concerns (MVC pattern)
- Middleware implementation

## 🔐 Environment Variables

Each project may require:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dbname
JWT_SECRET=your_secret_key
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
```

## 📦 Project Scripts

Common npm scripts across projects:

```bash
npm start          # Start the server
npm run dev        # Start in development mode with nodemon
npm run build      # Build for production
npm run lint       # Run ESLint
npm test           # Run tests (if configured)
```

## 🤝 Contributing

Feel free to fork this repository and create pull requests for improvements, bug fixes, or additional learning modules.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Your Name

## 💡 Tips for Learning

- Review each module's `readme.md` for specific instructions
- Examine the source code in `src/` directories
- Modify and experiment with code
- Add new features to existing projects
- Try connecting multiple modules together

---

**Happy Learning! 🎉**
