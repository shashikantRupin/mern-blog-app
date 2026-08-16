import React, { useState, useContext, useEffect } from "react";
import "../styles/nav.css";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { ThemeContext } from "./ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn, setLoggedIn, setToken, user, setUser } = useContext(AuthContext);
  const { toggleTheme, isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setLoggedIn(false);
    setToken("");
    setUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (loggedIn) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("email"));
        if (userInfo) setUser(userInfo);
      } catch (err) {
        console.error("Error reading stored user info:", err);
      }
    }
  }, [loggedIn, setUser]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const userDisplayName = user?.name || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <header className="navbar-header">
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-icon-wrapper">
            <span className="logo-symbol">✦</span>
          </div>
          <span className="logo-text">
            Blog<span className="logo-accent">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Home
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Explore Blogs
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            About
          </NavLink>

          {loggedIn && (
            <NavLink to="/myBlogs" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Right Actions: Create Button + Theme Toggle + Auth */}
        <div className="navbar-actions">
          {/* Create Blog Button (Authenticated) */}
          {loggedIn && (
            <Link to="/create" className="btn-create-post">
              <AddIcon fontSize="small" />
              <span>Write</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
          >
            {isDark ? (
              <LightModeIcon className="theme-icon sun" fontSize="small" />
            ) : (
              <DarkModeIcon className="theme-icon moon" fontSize="small" />
            )}
          </button>

          {/* Auth State */}
          {loggedIn ? (
            <div className="user-profile-pill">
              <div className="user-avatar" title={user?.email || "User"}>
                <span className="user-avatar-text">{userInitial}</span>
              </div>
              <span className="user-name" title={user?.email}>
                {userDisplayName}
              </span>
              <button
                onClick={handleLogout}
                className="logout-icon-btn"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogoutIcon fontSize="small" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-login-link">
                Sign In
              </Link>
              <Link to="/signup" className="nav-signup-btn">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                <div className="logo-icon-wrapper">
                  <span className="logo-symbol">✦</span>
                </div>
                <span className="logo-text">
                  Blog<span className="logo-accent">Nest</span>
                </span>
              </Link>
              <button className="mobile-close-btn" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              >
                Home
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              >
                Explore Blogs
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              >
                About
              </NavLink>

              {loggedIn ? (
                <>
                  <NavLink
                    to="/myBlogs"
                    className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  >
                    Dashboard & My Blogs
                  </NavLink>
                  <NavLink
                    to="/create"
                    className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  >
                    Write New Article
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  >
                    Create Account
                  </NavLink>
                </>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-theme-row">
                <span>Appearance</span>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                  {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </button>
              </div>

              {loggedIn && (
                <div className="mobile-user-row">
                  <div className="user-profile-pill full-width">
                    <div className="user-avatar">
                      <PersonIcon fontSize="small" />
                    </div>
                    <span className="user-name">{user?.email}</span>
                  </div>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <LogoutIcon fontSize="small" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
