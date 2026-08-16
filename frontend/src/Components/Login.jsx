import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/login.css";
import { AuthContext } from "./AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const Login = () => {
  const { setLoggedIn, setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/login`, formData);

      if (response.status === 200 || response.status === 201) {
        const { token, name, user } = response.data;
        setToken(token);
        setLoggedIn(true);
        const userData = { email: formData.email, name: name || user?.name || "" };
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("email", JSON.stringify(userData));
        navigate("/");
      } else {
        setLoginError(response.data?.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setLoginError(
        serverMsg || "Login failed. Please check your credentials and try again."
      );
      console.error("Error logging in:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-ambient-glow"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">✦</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your credentials to access your account & blog studio</p>
        </div>

        {loginError && (
          <div className="auth-alert error">
            <ErrorOutlineIcon fontSize="small" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <EmailOutlinedIcon className="auth-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <a href="#forgot" className="auth-forgot-link">Forgot?</a>
            </div>
            <div className="auth-input-wrapper">
              <LockOutlinedIcon className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-label">Keep me signed in</span>
            </label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loader}>
            {loader ? (
              <CircularProgress size={22} style={{ color: "#ffffff" }} />
            ) : (
              "Sign In"
            )}
          </button>

          <div className="auth-switch-prompt">
            Don't have an account?{" "}
            <NavLink to="/signup" className="auth-switch-link">
              Create an account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
