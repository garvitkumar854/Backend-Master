import React from "react";
import axios from "axios";

const CreatePost = () => {
  const handleSumbit = async (e) => {
    e.preventDefault(); // stop the reloading of website

    const formData = new FormData(e.target);

    axios
      .post("http://localhost:3000/create-post", formData)
      .then((response) => {
        console.log("Post Created:", response.data);
        alert("Post Created Successfully!");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
      });
  };

  return (
    <section className="create-post-section">
      <h1>Create New Post</h1>
      <form action="" onSubmit={handleSumbit}>
        <input type="file" name="image" id="" />
        <input
          type="text"
          name="caption"
          placeholder="Enter Caption"
          id=""
          required
        />
        <button type="submit">Create</button>
      </form>
    </section>
  );
};

export default CreatePost;
