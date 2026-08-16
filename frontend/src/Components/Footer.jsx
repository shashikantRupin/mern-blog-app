import React from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        {/* Brand & Bio */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">
            <div className="logo-icon-wrapper small">
              <span className="logo-symbol">✦</span>
            </div>
            <span className="logo-text">
              Blog<span className="logo-accent">Nest</span>
            </span>
          </Link>
          <p className="footer-tagline">
            A modern, open publishing platform empowering writers, developers, and creators to share ideas and connect with curious minds worldwide.
          </p>
          <div className="footer-social-links">
            <a
              href="https://www.linkedin.com/in/rupin-raj-d98/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="LinkedIn"
            >
              <i className="bx bxl-linkedin"></i>
            </a>
            <a
              href="https://github.com/shashikantRupin"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="GitHub"
            >
              <i className="bx bxl-github"></i>
            </a>
            <a
              href="https://instagram.com/rupin_raaz"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Instagram"
            >
              <i className="bx bxl-instagram"></i>
            </a>
            <a
              href="https://shashikantrupin.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Portfolio Website"
            >
              <i className="bx bx-globe"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/">Home Feed</Link>
            </li>
            <li>
              <Link to="/blogs">Explore Articles</Link>
            </li>
            <li>
              <Link to="/myBlogs">Creator Dashboard</Link>
            </li>
            <li>
              <Link to="/create">Write a Post</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">Topics</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/blogs">Technology & AI</Link>
            </li>
            <li>
              <Link to="/blogs">Design & UI/UX</Link>
            </li>
            <li>
              <Link to="/blogs">Food & Culinary</Link>
            </li>
            <li>
              <Link to="/blogs">News & Trends</Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="footer-col">
          <h4 className="footer-heading">About</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/about">Our Story</Link>
            </li>
            <li>
              <Link to="/about">Meet the Team</Link>
            </li>
            <li>
              <a href="mailto:shashikantrupin123@gmail.com">Contact Support</a>
            </li>
            <li>
              <a href="#terms">Terms & Privacy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p className="copyright-text">
          © {currentYear} BlogNest. Built with ❤️ for creators everywhere.
        </p>
        <div className="footer-bottom-links">
          <span>Fast, Accessible & Modern</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;