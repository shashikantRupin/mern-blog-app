import React, { useState, useContext } from "react";
import "../styles/Nav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn, setLoggedIn, setToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/" className="title">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/024/553/534/small/lion-head-logo-mascot-wildlife-animal-illustration-generative-ai-png.png"
          alt="logo"
          style={{ height: "80px" }}
        />
      </Link>

      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/blogs">Blogs</NavLink>
        </li>
        <li>
          <NavLink to="/myBlogs">My-Blogs</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/create">Create</NavLink>
        </li>
      </ul>

      <div style={{ marginRight: "30px" }}>
        {loggedIn ? (
          <>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>
              👤 {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: "5px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            style={{
              borderRadius: "5px",
              padding: "10px",
              backgroundColor: "#3498db",
              color: "white",
              textDecoration: "none",
            }}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
