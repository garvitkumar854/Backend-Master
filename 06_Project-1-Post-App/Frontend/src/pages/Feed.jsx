import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("//localhost:3000/posts").then((response) => {
      setPosts(response.data.posts);
      console.log("Posts in Feed:", response.data.posts);
    });
  }, []);

  return (
    <section className="feed-section">
      <h1>Feed</h1>
      <div className="post-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <img src={post.image} alt={post.caption} />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feed;
