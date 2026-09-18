import React, { useContext, useState, useRef } from "react";
import "../styles/create.css";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const CreateBlog = () => {
  const { token, getReadTime } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("tech");
  const [imageSource, setImageSource] = useState("file"); // "file" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFileMeta, setSelectedFileMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Process Local File (.jpg, .png, .jpeg, .webp)
  const processFile = (file) => {
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
      setErrorMsg("Please select a valid image file (.jpg, .png, .jpeg, or .webp).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setImageError(false);
      setSelectedFileMeta({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      });
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the local image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setSelectedFileMeta(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageError(false);
    setSelectedFileMeta(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Please provide both a title and article content.");
      return;
    }

    const formData = {
      title: title.trim(),
      content: content.trim(),
      type,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    };

    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/blogs/create`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMsg("Article published successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/myBlogs");
        }, 1200);
      } else {
        setErrorMsg("Unexpected response from the server. Please try again.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setErrorMsg(serverMsg || "Failed to create article. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page-container container">
      {/* Studio Header */}
      <div className="create-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowBackIcon fontSize="small" />
          <span>Back</span>
        </button>
        <div className="create-title-wrapper">
          <h1 className="create-main-title">Write New Story</h1>
          <p className="create-subtitle">Publish an article with local images (.jpg, .png) or web media</p>
        </div>
      </div>

      {errorMsg && (
        <div className="auth-alert error">
          <ErrorOutlineIcon fontSize="small" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="auth-alert success">
          <CheckCircleOutlineIcon fontSize="small" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form and Preview Layout */}
      <form onSubmit={handleSubmit} className="create-form-layout">
        <div className="create-main-fields">
          {/* Title Field */}
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10 Essential Design Patterns in Modern React"
              required
              className="create-title-input"
            />
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label">Category Topic</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="form-select"
            >
              <option value="tech">Technology & Code</option>
              <option value="news">News & Trends</option>
              <option value="food">Food & Culinary</option>
              <option value="health">Health & Wellness</option>
              <option value="other">Other Topics</option>
            </select>
          </div>

          {/* Cover Media Section (Local File vs URL) */}
          <div className="form-group">
            <div className="media-toggle-header">
              <label className="form-label">Cover Image</label>
              <div className="media-source-toggle">
                <button
                  type="button"
                  className={`source-tab-btn ${imageSource === "file" ? "active" : ""}`}
                  onClick={() => setImageSource("file")}
                >
                  <CloudUploadOutlinedIcon fontSize="small" />
                  <span>Upload Local File</span>
                </button>
                <button
                  type="button"
                  className={`source-tab-btn ${imageSource === "url" ? "active" : ""}`}
                  onClick={() => setImageSource("url")}
                >
                  <LinkIcon fontSize="small" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {imageSource === "file" ? (
              <div className="file-upload-zone-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: "none" }}
                  id="create-file-upload"
                />

                {!selectedFileMeta && !imageUrl ? (
                  <div
                    className={`file-dropzone ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="dropzone-icon-circle">
                      <CloudUploadOutlinedIcon fontSize="large" />
                    </div>
                    <div className="dropzone-text">
                      <span className="dropzone-prompt">Click to browse or drag & drop</span>
                      <span className="dropzone-hint">Supports JPG, PNG, JPEG, WEBP (Max 10MB)</span>
                    </div>
                  </div>
                ) : (
                  <div className="selected-file-card">
                    <img src={imageUrl} alt="Uploaded local preview" className="file-thumbnail" />
                    <div className="file-meta-info">
                      <span className="file-name-text">
                        {selectedFileMeta?.name || "Local Image Selected"}
                      </span>
                      {selectedFileMeta?.size && (
                        <span className="file-size-text">{selectedFileMeta.size}</span>
                      )}
                    </div>
                    <div className="file-actions-group">
                      <button
                        type="button"
                        className="btn-secondary file-change-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={handleRemoveImage}
                        title="Remove image"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="url-input-container">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-input"
                />
                <span className="url-hint">Paste an image link from Unsplash, Pexels, or any image host.</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="form-group">
            <label className="form-label">Article Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story, share code snippets, key takeaways, and lessons learned..."
              rows={14}
              required
              className="create-textarea"
            />
          </div>

          {/* Actions */}
          <div className="create-actions">
            <Link to="/myBlogs" className="btn-secondary">
              Discard Draft
            </Link>
            <button type="submit" className="btn-primary publish-btn" disabled={loading}>
              {loading ? (
                <CircularProgress size={20} style={{ color: "#ffffff" }} />
              ) : (
                <>
                  <PublishIcon fontSize="small" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Card Preview Sidebar */}
        <div className="create-preview-sidebar">
          <h3 className="preview-heading">Live Preview</h3>
          <div className="blog-card preview-card">
            <div className="card-media-wrapper">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt="Live Preview"
                  className="card-media-img"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="image-placeholder-box">
                  <ImageIcon fontSize="large" />
                  <span>{imageError ? "Invalid Image" : "No image uploaded yet"}</span>
                </div>
              )}
              <span className={`category-badge ${type}`}>{type}</span>
            </div>

            <div className="card-body">
              <div className="card-meta">
                <span className="card-date">Draft Preview</span>
                <span className="card-read-time">
                  {getReadTime ? getReadTime(content) : "1 min read"}
                </span>
              </div>

              <h4 className="card-title">{title || "Your article title will appear here..."}</h4>

              <p className="card-excerpt">
                {content || "Your article story preview and introductory paragraphs will be shown here..."}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
