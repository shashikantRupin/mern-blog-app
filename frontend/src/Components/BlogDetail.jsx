import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/blogsDetail.css";
import { AuthContext } from "./AuthContext";


const baseURL = process.env.REACT_APP_BASE_URL;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, confirmAction } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${baseURL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(response.data[0]);
      setFormData({
        title: response.data[0].title,
        content: response.data[0].content,
        type: response.data[0].type,
        imageUrl: response.data[0].imageUrl,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/blogs/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog updated successfully");
      setIsEditing(false);
      fetchBlog();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/blogs/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog deleted");
      navigate("/myBlogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleFormEdit=()=>{
    setIsEditing(true);
  }

  if (loading) {
    return (
      <div className="loading-container">
        <img
          src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1260.gif"
          alt="loading"
        />
      </div>
    );
  }

  if (!blog) {
    return <div className="no-blog">No blog found.</div>;
  }

  return (
    <>
      <div className="blog-detail">
        <img src={blog.imageUrl} alt="Blog Cover" className="blog-image-detail" />
        <h2>{blog.title}</h2>
        <p>{blog.content}</p>
        <p>
          <strong>Author:</strong> {blog.auth_email}
        </p>

        <div className="button-group">
          <button onClick={handleFormEdit}>
            Edit{" "}
            <img
              src="https://cdn3.iconfinder.com/data/icons/feather-5/24/edit-512.png"
              alt="edit"
              className="icon"
            />
          </button>
          <button onClick={handleDelete}>
            Delete{" "}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3687/3687412.png"
              alt="delete"
              className="icon"
            />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-form" id="update">
          <h2>Update Blog</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label>
              Content:
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="update-blog-btn">Update Blog</button>
          </form>
        </div>
      )}
    </>
  );
};

export default BlogDetail;
