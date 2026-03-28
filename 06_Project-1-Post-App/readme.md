# Project 1: Social Media Post App - Learning Guide

## 🎯 Project Overview

Build a complete social media application where users can:
- Create posts with images and captions
- View all posts in a feed
- Delete their posts
- Images stored in cloud (ImageKit), not on server

**Architecture**: Backend (Express + MongoDB) + Frontend (React + Vite)

---

## 📚 What You'll Learn

### Backend Concepts
- [x] File upload handling (Multer middleware)
- [x] Cloud storage integration (ImageKit)
- [x] RESTful API design (POST, GET, DELETE)
- [x] Database operations (Create, Read, Delete)
- [x] Cross-Origin Resource Sharing (CORS)
- [x] Error handling and validation
- [x] Base64 encoding for binary data
- [x] Environment variables management

### Frontend Concepts
- [x] React hooks (useState, useEffect)
- [x] React Router for navigation
- [x] API calls with Axios
- [x] Form handling and submission
- [x] Conditional rendering
- [x] Component composition

---

## 🛠️ Backend Implementation

### Step 1: Project Setup
```bash
# Create backend folder
mkdir Backend
cd Backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express mongoose cors multer dotenv
npm install --save-dev nodemon
```

### Step 2: Environment Variables
Create `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/post-app
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Step 3: Database Connection (`src/db/db.js`)
**Purpose**: Connect to MongoDB using Mongoose

**Key Learning Points**:
- Async/await for handling promises
- Error handling in try/catch
- Environment variable usage

**See file for detailed comments**

### Step 4: Create Post Model (`src/models/post.model.js`)
**Purpose**: Define post schema and database structure

**Schema Fields**:
- `fileId` (String) - ImageKit file identifier
- `image` (String) - Public URL to image
- `caption` (String) - Post text content

**Key Learning Points**:
- Mongoose schema definition
- Model creation
- Field types and options

### Step 5: ImageKit Service (`src/services/storage.service.js`)
**Purpose**: Handle cloud file uploads and deletions

**Functions**:
- `uploadImage(buffer)` - Upload image to ImageKit
- `deleteImage(fileId)` - Delete image from ImageKit

**Key Learning Points**:
- Base64 encoding (binary to text)
- Third-party API integration
- File management in cloud
- Why cloud vs server storage

### Step 6: API Endpoints (`src/app.js`)

#### Endpoint 1: Create Post
**Method**: POST `/create-post`
**Request**: multipart/form-data
- Field: `image` (file) - JPEG/PNG image
- Field: `caption` (text) - Post description

**Workflow**:
1. Multer extracts file from request
2. uploadImage() sends to ImageKit
3. Post document created in MongoDB
4. Response includes file metadata

**Key Learning Points**:
- Multer middleware
- Memory storage vs disk storage
- Async operations
- HTTP status codes (201 Created)

#### Endpoint 2: Get All Posts
**Method**: GET `/posts`
**Response**: Array of all posts

**Key Learning Points**:
- Find operations in Mongoose
- Returning data from database
- HTTP 200 OK response

#### Endpoint 3: Delete Post
**Method**: DELETE `/delete-post/:id`
**Parameter**: fileId (from URL)

**Workflow**:
1. Find post in database
2. Delete image from ImageKit
3. Delete post from MongoDB
4. Return success

**Key Learning Points**:
- Two-step deletion (cloud + database)
- Try/catch error handling
- Coordinating across services
- Query by specific field

---

## 🎨 Frontend Implementation

### Step 1: Create Vite React App
```bash
npm create vite@latest Frontend -- --template react
cd Frontend
npm install
```

### Step 2: Install Dependencies
```bash
npm install react-router-dom axios
```

### Step 3: Project Structure
```
src/
├── pages/
│   ├── CreatePost.jsx      # Form to create post
│   └── Feed.jsx             # Display all posts
├── components/
│   └── Navbar.jsx           # Navigation
├── App.jsx                  # Routes
├── App.css                  # Styles
└── main.jsx                 # Entry point
```

### Step 4: Setup Routes (`App.jsx`)
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 5: Feed Page (`pages/Feed.jsx`)
**Purpose**: Display all posts from database

**Features**:
- Fetch posts on component mount
- Display posts in grid/list
- Show image and caption
- Delete button for each post

**Key Learning Points**:
- `useEffect` for side effects
- Axios API calls
- Array mapping for rendering
- Loading states

**Code Example**:
```javascript
const [posts, setPosts] = useState([]);

useEffect(() => {
  // Fetch posts when component mounts
  axios.get('http://localhost:3000/posts')
    .then(res => setPosts(res.data.posts))
    .catch(err => console.log(err));
}, []); // Empty dependency array = run once
```

### Step 6: Create Post Page (`pages/CreatePost.jsx`)
**Purpose**: Form to create new posts

**Features**:
- Image file input
- Caption textarea
- Form submission
- Navigate after success

**Key Learning Points**:
- `useState` for form state
- Form submission handling
- File input handling
- `useNavigate` for routing
- FormData for multipart requests

**Code Example**:
```javascript
const [caption, setCaption] = useState('');
const [image, setImage] = useState(null);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('image', image);
  
  try {
    await axios.post('http://localhost:3000/create-post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    navigate('/'); // Go back to feed
  } catch (err) {
    console.log(err);
  }
};
```

### Step 7: Delete Post Functionality
```javascript
const handleDelete = async (fileId) => {
  try {
    await axios.delete(`http://localhost:3000/delete-post/${fileId}`);
    // Refresh posts
  } catch (err) {
    console.log(err);
  }
};
```

---

## 🔧 Common Issues & Solutions

### Issue: CORS Error
**Problem**: Frontend can't reach backend API
```
Access to XMLHttpRequest from origin 'http://localhost:5173' has been blocked
```

**Solution**:
1. Install CORS in backend: `npm install cors`
2. Add to `src/app.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

**Key Learning**: Browsers restrict cross-origin requests for security

### Issue: File Upload Not Working
**Problem**: `req.file` is undefined

**Solution**:
1. Ensure Multer is configured: `upload.single('image')`
2. Field name in frontend matches: `formData.append('image', file)`
3. Content-Type header: `'multipart/form-data'`

### Issue: Image URL Returns 404
**Problem**: ImageKit URL is broken

**Solution**:
- Check IMAGEKIT_PRIVATE_KEY in .env
- Verify imagekit library is installed
- Test upload returns valid URL

---

## 📋 Development Workflow

### Backend Development
```bash
cd Backend
npm run dev  # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd Frontend
npm run dev  # Vite dev server on http://localhost:5173
```

### Testing
1. **Create Post**: Fill form and submit
   - Verify image uploaded to ImageKit
   - Verify post created in MongoDB
   - Verify response success

2. **View Posts**: Check feed loads
   - Posts display from database
   - Images load correctly
   - Caption text shows

3. **Delete Post**: Click delete
   - Post removed from feed
   - Image URL becomes invalid
   - Post deleted from database

---

## 🎓 Learning Checkpoints

Before moving to the next project, verify you understand:

- [ ] **Multer**: How file uploads work, memory vs disk storage
- [ ] **Base64**: Why we encode binary data
- [ ] **ImageKit**: Why use cloud storage vs server storage
- [ ] **CORS**: Why browsers restrict cross-origin requests
- [ ] **Axios**: How to make API requests from React
- [ ] **useEffect**: Dependency arrays and side effects
- [ ] **FormData**: Sending files and form data together
- [ ] **Error Handling**: Try/catch vs .catch() promises
- [ ] **async/await**: Making synchronous-looking async code

---

## 💡 Advanced Enhancements

Try adding these features:
1. **Pagination**: Load posts 10 at a time
2. **Search**: Filter posts by caption
3. **User System**: Add authentication before creating posts
4. **Like/Comment**: Store reactions in database
5. **Edit Post**: Modify caption after creation
6. **Image Optimization**: Resize/compress before upload

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [ImageKit Documentation](https://imagekit.io/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Axios Documentation](https://axios-http.com/)

---

**This project teaches full-stack development with real cloud integration!**
