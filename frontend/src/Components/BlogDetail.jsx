import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/blogsDetail.css";
import { AuthContext } from "./AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CircularProgress } from "@mui/material";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, confirmAction, getTime, getReadTime } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
    imageUrl: "",
  });
  const [editImageSource, setEditImageSource] = useState("file"); // "file" | "url"
  const [selectedFileMeta, setSelectedFileMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const editFileInputRef = useRef(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setBlog(data);
      if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "tech",
          imageUrl: data.imageUrl || "",
        });
      }
    } catch (error) {
      console.error("Error fetching blog detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Process Local File for Edit
  const processEditFile = (file) => {
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
      setEditError("Please select a valid image file (.jpg, .png, .jpeg, .webp).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setEditError("Image size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setEditError("");
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      setSelectedFileMeta({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      });
    };
    reader.onerror = () => {
      setEditError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processEditFile(file);
  };

  const handleEditDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleEditDragLeave = () => {
    setIsDragging(false);
  };

  const handleEditDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processEditFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    try {
      setUpdating(true);
      await axios.put(`${baseURL}/blogs/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      fetchBlog();
    } catch (error) {
      console.error("Error updating blog:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setEditError(serverMsg || "Failed to update article. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = confirmAction
      ? await confirmAction(
          "Delete Article",
          "Are you sure you want to permanently delete this article? This action cannot be undone."
        )
      : window.confirm("Are you sure you want to delete this blog?");

    if (!isConfirmed) return;

    try {
      await axios.delete(`${baseURL}/blogs/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/myBlogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) {
    return (
      <div className="article-loading-container container">
        <CircularProgress size={40} style={{ color: "var(--accent-primary)" }} />
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="empty-state-card container" style={{ marginTop: "60px" }}>
        <div className="empty-state-icon">📄</div>
        <h3 className="empty-state-title">Article not found</h3>
        <p className="empty-state-text">The requested article could not be located or may have been removed.</p>
        <Link to="/blogs" className="btn-primary">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="article-detail-page container">
      {/* Top Navigation */}
      <div className="article-top-nav">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowBackIcon fontSize="small" />
          <span>Back</span>
        </button>

        {/* Creator Controls */}
        <div className="article-actions">
          <button onClick={() => setIsEditing(!isEditing)} className="btn-secondary article-action-btn">
            <EditOutlinedIcon fontSize="small" />
            <span>{isEditing ? "Close Editor" : "Edit Post"}</span>
          </button>
          <button onClick={handleDelete} className="btn-danger article-action-btn">
            <DeleteOutlineIcon fontSize="small" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Edit Mode Studio */}
      {isEditing && (
        <div className="article-edit-card">
          <h2 className="edit-card-title">Edit Article Details</h2>

          {editError && (
            <div className="auth-alert error" style={{ marginBottom: "20px" }}>
              <ErrorOutlineIcon fontSize="small" />
              <span>{editError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-form-grid">
            <div className="form-group full-width">
              <label className="form-label">Article Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Category</label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                <option value="tech">Technology</option>
                <option value="food">Food & Culinary</option>
                <option value="news">News & Trends</option>
                <option value="health">Health & Wellness</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Media Upload Options for Edit */}
            <div className="form-group full-width">
              <div className="media-toggle-header">
                <label className="form-label">Update Cover Image (.jpg, .png, .webp)</label>
                <div className="media-source-toggle">
                  <button
                    type="button"
                    className={`source-tab-btn ${editImageSource === "file" ? "active" : ""}`}
                    onClick={() => setEditImageSource("file")}
                  >
                    <CloudUploadOutlinedIcon fontSize="small" />
                    <span>Upload Local File</span>
                  </button>
                  <button
                    type="button"
                    className={`source-tab-btn ${editImageSource === "url" ? "active" : ""}`}
                    onClick={() => setEditImageSource("url")}
                  >
                    <LinkIcon fontSize="small" />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {editImageSource === "file" ? (
                <div className="file-upload-zone-wrapper">
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    style={{ display: "none" }}
                    id="edit-file-upload"
                  />

                  <div
                    className={`file-dropzone ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleEditDragOver}
                    onDragLeave={handleEditDragLeave}
                    onDrop={handleEditDrop}
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <div className="dropzone-icon-circle">
                      <CloudUploadOutlinedIcon fontSize="large" />
                    </div>
                    <div className="dropzone-text">
                      <span className="dropzone-prompt">
                        {selectedFileMeta ? `Selected: ${selectedFileMeta.name}` : "Click or drag & drop new image"}
                      </span>
                      <span className="dropzone-hint">Supports JPG, PNG, JPEG, WEBP (Max 10MB)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="url-input-container">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>
              )}

              {/* Current / New Image Thumbnail */}
              {formData.imageUrl && (
                <div className="edit-image-preview-strip">
                  <img src={formData.imageUrl} alt="Updated Preview" className="edit-preview-img" />
                  <span className="edit-preview-label">Live Image Preview</span>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Article Body Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                required
                className="form-textarea"
              />
            </div>

            <div className="edit-form-actions full-width">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={updating}>
                {updating ? <CircularProgress size={20} style={{ color: "#fff" }} /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Article Content */}
      <article className="article-main-wrapper">
        <div className="article-header">
          <div className="article-meta-tags">
            <span className={`category-badge ${blog.type?.toLowerCase() || "tech"}`}>
              {blog.type || "Article"}
            </span>
            <span className="article-date">
              <AccessTimeIcon fontSize="inherit" />
              {getTime ? getTime(blog.createdAt) : "Recently"}
            </span>
            <span className="article-read-time">
              {getReadTime ? getReadTime(blog.content) : "1 min read"}
            </span>
          </div>

          <h1 className="article-title">{blog.title}</h1>

          <div className="article-author-card">
            <div className="author-avatar-large">
              {(blog.auth_email || "A").charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <span className="author-name-large">
                {blog.auth_email ? blog.auth_email.split("@")[0] : "Author"}
              </span>
              <span className="author-email">{blog.auth_email}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {blog.imageUrl && (
          <div className="article-cover-container">
            <img src={blog.imageUrl} alt={blog.title} className="article-cover-img" />
          </div>
        )}

        {/* Article Body */}
        <div className="article-body-content">
          <p>{blog.content}</p>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
