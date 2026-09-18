import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import SkeletonCard from "./SkeletonCard";
import "../styles/blogs.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const categories = [
  { id: "", label: "All Topics" },
  { id: "tech", label: "Technology" },
  { id: "food", label: "Food & Culinary" },
  { id: "news", label: "News & Trends" },
  { id: "health", label: "Health & Wellness" },
  { id: "other", label: "Other" },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { token, getTime, getReadTime } = useContext(AuthContext);

  const fetchBlogs = async (categoryType) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/blogs${categoryType ? `?type=${categoryType}` : ""}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (Array.isArray(response?.data)) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBlogs(type);
  }, [token, type]);

  // Client-side search filtering
  const filteredBlogs = blogs.filter((blog) => {
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = blog.auth_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || contentMatch || authorMatch;
  });

  return (
    <div className="blogs-explore-page container">
      {/* Header Banner */}
      <div className="explore-header">
        <div className="explore-header-content">
          <div className="explore-tag">
            <AutoStoriesOutlinedIcon fontSize="small" />
            <span>Discover Knowledge</span>
          </div>
          <h1 className="explore-title">
            Explore <span className="title-gradient">Articles & Insights</span>
          </h1>
          <p className="explore-subtitle">
            Browse our complete catalog of developer guides, design trends, tech tutorials, and curated essays.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="explore-search-wrapper">
          <SearchIcon className="search-input-icon" />
          <input
            type="text"
            placeholder="Search by title, topic, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="explore-search-input"
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm("")} aria-label="Clear search">
              <ClearIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
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

      {/* Articles Grid */}
      <div className="articles-grid">
        {/* Loading Skeletons */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Loaded Articles */}
        {!loading &&
          filteredBlogs.length > 0 &&
          filteredBlogs.map((blog) => (
            <article className="blog-card" key={blog._id}>
              <div className="card-media-wrapper">
                <Link to={`/blogDetail/${blog._id}`} className="card-media-link">
                  <img
                    src={
                      blog.imageUrl ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={blog.title}
                    className="card-media-img"
                    loading="lazy"
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
                    {getTime ? getTime(blog.createdAt) : "Recently"}
                  </span>
                  <span className="card-read-time">
                    {getReadTime ? getReadTime(blog.content) : "1 min read"}
                  </span>
                </div>

                <Link to={`/blogDetail/${blog._id}`} className="card-title-link">
                  <h3 className="card-title">{blog.title}</h3>
                </Link>

                <p className="card-excerpt">{blog.content}</p>

                <div className="card-footer">
                  <div className="author-info">
                    <div className="author-avatar-chip">
                      {(blog.auth_email || "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="author-name">
                      {blog.auth_email ? blog.auth_email.split("@")[0] : "Author"}
                    </span>
                  </div>

                  <Link to={`/blogDetail/${blog._id}`} className="card-read-more" aria-label="Read full article">
                    <span>Read</span>
                    <ArrowForwardIcon fontSize="inherit" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Empty State */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-state-icon">📂</div>
          <h3 className="empty-state-title">No articles found</h3>
          <p className="empty-state-text">
            {searchTerm
              ? `No articles matched your search for "${searchTerm}". Try different keywords.`
              : "There are currently no articles in this category. Be the first to publish one!"}
          </p>
          <div className="empty-state-actions">
            {searchTerm && (
              <button className="btn-secondary" onClick={() => setSearchTerm("")}>
                Clear Search
              </button>
            )}
            <Link to="/create" className="btn-primary">
              Write an Article
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
