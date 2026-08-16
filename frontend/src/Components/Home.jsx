import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/home.css";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const staticBlogs = [
  {
    _id: "static1",
    imageUrl: img1,
    type: "tech",
    title: "Mastering Modern UI/UX Architecture with Figma & React",
    date: "12 Feb 2024",
    content: "Discover industry-standard UI design principles, design tokens, and components to build polished experiences.",
    author: "Elena Rostova",
  },
  {
    _id: "static2",
    imageUrl: img2,
    type: "food",
    title: "Culinary Aesthetics: The Art of Visual Flavor Storytelling",
    date: "10 Mar 2024",
    content: "How master chefs and culinary creators use visual storytelling and design principles to elevate modern gastronomy.",
    author: "Chef Marcus",
  },
  {
    _id: "static3",
    imageUrl: img3,
    type: "news",
    title: "Designing Inclusive Digital Experiences: The A11y Revolution",
    date: "05 Jan 2024",
    content: "Why modern digital applications must prioritize web accessibility, contrast ratios, and semantic structure from day one.",
    author: "David Chen",
  },
];

const categories = [
  { id: "", label: "All Topics" },
  { id: "tech", label: "Technology" },
  { id: "food", label: "Food & Culinary" },
  { id: "news", label: "News & Trends" },
  { id: "health", label: "Health & Wellness" },
  { id: "other", label: "Other" },
];

const Home = () => {
  const { token, loggedIn, getTime } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

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
      console.log("Blogs feed note:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchBlogs(type);
    }
  }, [token, type]);

  // Filter static blogs if category is selected
  const filteredStaticBlogs = type
    ? staticBlogs.filter((b) => b.type.toLowerCase() === type.toLowerCase())
    : staticBlogs;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <span className="badge-sparkle">✦</span>
            <span>Welcome to the Next Generation Blog Platform</span>
          </div>

          <h1 className="hero-title">
            Discover Great Ideas, <br />
            <span className="hero-title-gradient">Stories & Perspectives</span>
          </h1>

          <p className="hero-description">
            Dive into a world of curated articles, deep technical insights, culinary trends, and inspirational stories published by passionate writers worldwide.
          </p>

          <div className="hero-cta-group">
            <Link to="/blogs" className="btn-primary hero-btn">
              <AutoStoriesOutlinedIcon fontSize="small" />
              <span>Explore Articles</span>
            </Link>

            {loggedIn ? (
              <Link to="/create" className="btn-secondary hero-btn">
                <CreateOutlinedIcon fontSize="small" />
                <span>Write a Story</span>
              </Link>
            ) : (
              <Link to="/signup" className="btn-secondary hero-btn">
                <span>Join as a Writer</span>
                <ArrowForwardIcon fontSize="small" />
              </Link>
            )}
          </div>

          <div className="hero-stats-strip">
            <div className="stat-chip">
              <span className="stat-chip-dot"></span>
              <span>10,000+ Readers</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-dot"></span>
              <span>Fast & Minimal</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-dot"></span>
              <span>Open Publishing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Card */}
      <section className="spotlight-section container">
        <div className="spotlight-card">
          <div className="spotlight-content">
            <div className="spotlight-tag">
              <TrendingUpIcon fontSize="small" />
              <span>Featured Spotlight</span>
            </div>
            <h2 className="spotlight-title">
              Catch Up With What's Shaping the Creative World
            </h2>
            <p className="spotlight-text">
              From the evolution of generative AI tools and design systems to sustainable culinary culture, stay ahead of the curve with our community's top curated reads.
            </p>
            <Link to="/blogs" className="spotlight-link">
              <span>Browse All Topics</span>
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
          <div className="spotlight-media">
            <img
              src="https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?q=80&w=1000&auto=format&fit=crop"
              alt="Spotlight feature"
              className="spotlight-image"
            />
          </div>
        </div>
      </section>

      {/* Main Feed Section */}
      <section className="feed-section container">
        <div className="feed-header">
          <div>
            <h2 className="feed-title">Latest Publications</h2>
            <p className="feed-subtitle">Explore recently published articles across your favorite categories</p>
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
            </>
          )}

          {/* Dynamic API Blogs (if logged in and loaded) */}
          {!loading &&
            blogs &&
            blogs.length > 0 &&
            blogs.map((blog) => (
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
                    <span className="card-read-time">4 min read</span>
                  </div>

                  <Link to={`/blogDetail/${blog._id}`} className="card-title-link">
                    <h3 className="card-title">{blog.title}</h3>
                  </Link>

                  <p className="card-excerpt">{blog.content || blog.description}</p>

                  <div className="card-footer">
                    <div className="author-info">
                      <div className="author-avatar-chip">
                        {(blog.auth_email || blog.author || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="author-name">
                        {blog.author || (blog.auth_email ? blog.auth_email.split("@")[0] : "Author")}
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

          {/* Static Featured Blogs */}
          {!loading &&
            filteredStaticBlogs.map((blog) => (
              <article className="blog-card" key={blog._id}>
                <div className="card-media-wrapper">
                  <div className="card-media-link">
                    <img src={blog.imageUrl} alt={blog.title} className="card-media-img" loading="lazy" />
                  </div>
                  <span className={`category-badge ${blog.type?.toLowerCase() || "tech"}`}>
                    {blog.type}
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-date">
                      <AccessTimeIcon fontSize="inherit" />
                      {blog.date}
                    </span>
                    <span className="card-read-time">5 min read</span>
                  </div>

                  <h3 className="card-title">{blog.title}</h3>

                  <p className="card-excerpt">{blog.content}</p>

                  <div className="card-footer">
                    <div className="author-info">
                      <div className="author-avatar-chip">
                        {blog.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="author-name">{blog.author}</span>
                    </div>

                    <span className="featured-card-badge">Featured</span>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
