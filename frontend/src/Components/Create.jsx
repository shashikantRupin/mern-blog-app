import React, { useContext, useState } from "react";
import "../styles/create.css";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
const baseURL = process.env.REACT_APP_BASE_URL;

const CreateBlog = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, content, type, imageUrl };
    try {
      const response = await axios.post(`${baseURL}/blogs/create`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("response", response);
      if (response.status === 201 || response.status === 200) {
        alert("Blog created successfully!");
        setTitle("");
        setContent("");
        setType("");
        setImageUrl("");
        navigate("/myBlogs");
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "black" }}>Create Blog</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "500px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          marginLeft: "200px",
          marginTop: "50px",
        }}
      >
        <h2 style={{ color: "black" }}>Write Your Blog</h2>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="tech">Tech</option>
            <option value="news">News</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
