import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="navbar">
          <h1>Post App</h1>
          <div className="nav-links">
            <Link to="/">Feed</Link>
            <Link to="/create">Create Post</Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
