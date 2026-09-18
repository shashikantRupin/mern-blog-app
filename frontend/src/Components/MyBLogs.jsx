import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import SkeletonCard from "./SkeletonCard";
import "../styles/myBlog.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const categories = [
  { id: "", label: "All Topics" },
  { id: "tech", label: "Technology" },
  { id: "food", label: "Food" },
  { id: "news", label: "News" },
  { id: "health", label: "Health" },
  { id: "other", label: "Other" },
];

const MyBlogs = () => {
  const { token, user, confirmAction, getTime, getReadTime } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async (categoryType = "", currentUser) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/blogs${categoryType ? `?type=${categoryType}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userEmail = currentUser?.email || user?.email;
      const filteredBlogs = (response?.data || []).filter(
        (blog) => blog.auth_email === userEmail
      );
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = () => {
    let currentUser = user;
    try {
      const stored = JSON.parse(localStorage.getItem("email"));
      if (stored) currentUser = stored;
    } catch (e) {}
    fetchBlogs(type, currentUser);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    updateData();
  }, [token, type]);

  const handleDelete = async (id) => {
    const isConfirmed = confirmAction
      ? await confirmAction(
          "Confirm Deletion",
          "Are you sure you want to permanently delete this blog post? This cannot be undone."
        )
      : window.confirm("Are you sure you want to delete this blog?");

    if (!isConfirmed) return;

    try {
      const res = await axios.delete(`${baseURL}/blogs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200 || res.status === 201) {
        updateData();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };

  // Derived statistics
  const totalPosts = blogs.length;
  const uniqueCategories = new Set(blogs.map((b) => b.type).filter(Boolean)).size;
  const latestPost = blogs.length > 0 ? (getTime ? getTime(blogs[0]?.createdAt) : "Recently") : "No posts yet";

  // Filtered by search term
  const displayedBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page container">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-badge">Creator Studio</div>
          <h1 className="dashboard-title">My Dashboard & Articles</h1>
          <p className="dashboard-subtitle">
            Manage your published stories, monitor article stats, and compose new articles.
          </p>
        </div>

        <Link to="/create" className="btn-primary">
          <AddIcon fontSize="small" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon articles">
            <ArticleOutlinedIcon />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Total Articles</span>
            <h3 className="stat-card-value">{totalPosts}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon categories">
            <CategoryOutlinedIcon />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Active Topics</span>
            <h3 className="stat-card-value">{uniqueCategories}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon date">
            <CalendarMonthOutlinedIcon />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Latest Publication</span>
            <h3 className="stat-card-value small">{latestPost}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dashboard-filter-row">
        <div className="filter-pill-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${type === cat.id ? "active" : ""}`}
              onClick={() => setType(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="dashboard-search-wrapper">
          <SearchIcon className="search-input-icon" />
          <input
            type="text"
            placeholder="Search your articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="explore-search-input"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading &&
          displayedBlogs.map((blog) => (
            <article className="blog-card dashboard-article-card" key={blog._id}>
              <div className="card-media-wrapper">
                <Link to={`/blogDetail/${blog._id}`} className="card-media-link">
                  <img
                    src={
                      blog.imageUrl ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={blog.title}
                    className="card-media-img"
                  />
                </Link>
                <span className={`category-badge ${blog.type?.toLowerCase() || "tech"}`}>
                  {blog.type || "General"}
                </span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="card-date">
                    <AccessTimeIcon fontSize="inherit" />
                    {getTime ? getTime(blog.createdAt) : "Published"}
                  </span>
                  <span className="card-read-time">
                    {getReadTime ? getReadTime(blog.content) : "1 min read"}
                  </span>
                </div>

                <Link to={`/blogDetail/${blog._id}`} className="card-title-link">
                  <h3 className="card-title">{blog.title}</h3>
                </Link>

                <p className="card-excerpt">{blog.content}</p>

                <div className="dashboard-card-actions">
                  <Link to={`/blogDetail/${blog._id}`} className="dash-btn view">
                    <VisibilityOutlinedIcon fontSize="small" />
                    <span>View</span>
                  </Link>

                  <Link to={`/blogDetail/${blog._id}`} className="dash-btn edit">
                    <EditOutlinedIcon fontSize="small" />
                    <span>Edit</span>
                  </Link>

                  <button
                    className="dash-btn delete"
                    onClick={() => handleDelete(blog._id)}
                    aria-label="Delete article"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Empty State */}
      {!loading && displayedBlogs.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-state-icon">✍️</div>
          <h3 className="empty-state-title">
            {searchTerm ? "No matching articles found" : "You haven't written any articles yet"}
          </h3>
          <p className="empty-state-text">
            {searchTerm
              ? `No articles match "${searchTerm}". Try resetting your filter.`
              : "Share your knowledge, ideas, or guides with the world. Click below to start composing your first post!"}
          </p>
          <div className="empty-state-actions">
            {searchTerm ? (
              <button className="btn-secondary" onClick={() => setSearchTerm("")}>
                Clear Search
              </button>
            ) : (
              <Link to="/create" className="btn-primary">
                <AddIcon fontSize="small" />
                <span>Create Your First Article</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
