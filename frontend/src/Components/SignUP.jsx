import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:7000";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loader, setLoader] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password validation criteria
  const password = formData.password;
  const criteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  };

  const validCount = Object.values(criteria).filter(Boolean).length;
  const isStrongPassword = validCount === 5;

  const getStrengthMeta = () => {
    if (!password) return { label: "", percent: 0, className: "" };
    if (validCount <= 2) return { label: "Weak", percent: 30, className: "weak" };
    if (validCount <= 4) return { label: "Moderate", percent: 70, className: "medium" };
    return { label: "Strong & Secure", percent: 100, className: "strong" };
  };

  const strengthMeta = getStrengthMeta();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    // Client-side strength check
    if (!isStrongPassword) {
      setSignupError(
        "Please create a stronger password meeting all requirements (e.g. Rupin@123)."
      );
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/signup`, formData);
      if (response.status === 200 || response.status === 201) {
        setSignupSuccess("Account created successfully! Redirecting to login...");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setSignupError(response.data?.msg || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      const serverMsg = error.response?.data?.msg || error.response?.data?.message;
      setSignupError(serverMsg || "Failed to create account. Please check your details.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-ambient-glow"></div>

      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="auth-logo-badge">✦</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join BlogNest to publish stories, connect with readers, and grow</p>
        </div>

        {signupError && (
          <div className="auth-alert error">
            <ErrorOutlineIcon fontSize="small" />
            <span>{signupError}</span>
          </div>
        )}

        {signupSuccess && (
          <div className="auth-alert success">
            <CheckCircleOutlineIcon fontSize="small" />
            <span>{signupSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrapper">
              <PersonOutlineIcon className="auth-input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                required
                className="auth-input"
              />
            </div>
          </div>

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
              <span className="password-example-hint">e.g. Rupin@123</span>
            </div>

            <div className="auth-input-wrapper">
              <LockOutlinedIcon className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                placeholder="Create a strong password"
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

            {/* Live Strength Meter Bar */}
            {password.length > 0 && (
              <div className="strength-meter-container">
                <div className="strength-meter-header">
                  <span className="strength-text">Password Strength:</span>
                  <span className={`strength-badge ${strengthMeta.className}`}>
                    {strengthMeta.label}
                  </span>
                </div>
                <div className="strength-meter-track">
                  <div
                    className={`strength-meter-fill ${strengthMeta.className}`}
                    style={{ width: `${strengthMeta.percent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Interactive Password Requirements Checklist */}
            {(isPasswordFocused || password.length > 0) && (
              <div className="password-checklist-box">
                <span className="checklist-title">Password must contain:</span>
                <div className="checklist-grid">
                  <div className={`checklist-item ${criteria.minLength ? "met" : ""}`}>
                    {criteria.minLength ? (
                      <CheckIcon className="check-icon met" fontSize="inherit" />
                    ) : (
                      <CloseIcon className="check-icon" fontSize="inherit" />
                    )}
                    <span>8+ characters</span>
                  </div>

                  <div className={`checklist-item ${criteria.hasUpper ? "met" : ""}`}>
                    {criteria.hasUpper ? (
                      <CheckIcon className="check-icon met" fontSize="inherit" />
                    ) : (
                      <CloseIcon className="check-icon" fontSize="inherit" />
                    )}
                    <span>Uppercase (A-Z)</span>
                  </div>

                  <div className={`checklist-item ${criteria.hasLower ? "met" : ""}`}>
                    {criteria.hasLower ? (
                      <CheckIcon className="check-icon met" fontSize="inherit" />
                    ) : (
                      <CloseIcon className="check-icon" fontSize="inherit" />
                    )}
                    <span>Lowercase (a-z)</span>
                  </div>

                  <div className={`checklist-item ${criteria.hasDigit ? "met" : ""}`}>
                    {criteria.hasDigit ? (
                      <CheckIcon className="check-icon met" fontSize="inherit" />
                    ) : (
                      <CloseIcon className="check-icon" fontSize="inherit" />
                    )}
                    <span>Number (0-9)</span>
                  </div>

                  <div className={`checklist-item ${criteria.hasSpecial ? "met" : ""}`}>
                    {criteria.hasSpecial ? (
                      <CheckIcon className="check-icon met" fontSize="inherit" />
                    ) : (
                      <CloseIcon className="check-icon" fontSize="inherit" />
                    )}
                    <span>Special (@, #, $, %)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" id="terms" required />
              <span className="checkbox-label">
                I agree to the <a href="#terms">Terms of Service</a> & <a href="#privacy">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loader || (password.length > 0 && !isStrongPassword)}
          >
            {loader ? (
              <CircularProgress size={22} style={{ color: "#ffffff" }} />
            ) : (
              "Create Account"
            )}
          </button>

          <div className="auth-switch-prompt">
            Already have an account?{" "}
            <NavLink to="/login" className="auth-switch-link">
              Sign in
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
