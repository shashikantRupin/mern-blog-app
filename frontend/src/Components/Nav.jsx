import React, { useState, useContext, useEffect } from "react";
import "../styles/nav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn, setLoggedIn, setToken, user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(()=>{
    // console.log("user-123",user);
    // console.log("logged-123",loggedIn);
    if(loggedIn){
     let userInfo= JSON.parse(localStorage.getItem("email"));
    //  console.log("userinfo234",userInfo);
     setUser(userInfo);
    }
  },[loggedIn])

  return (
    <nav>
      <div className="title-link-wrapper">
        <Link to="/" className="title">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/024/553/534/small/lion-head-logo-mascot-wildlife-animal-illustration-generative-ai-png.png"
            alt="logo"
            style={{ height: "80px" }}
            className="logo-blog"
          />
        </Link>

        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={menuOpen ? "open" : "nav-list"}>
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
      </div>

      <div style={{ marginRight: "30px" }} className="login-logout">
        {loggedIn ? (
          <>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>
              👤 {user?.email}
            </span>
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={()=>navigate("/login")}
           className="login-btn"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
