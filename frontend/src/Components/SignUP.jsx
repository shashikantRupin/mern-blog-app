import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const baseURL = process.env.REACT_APP_BASE_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await axios.post(`${baseURL}/signup`, formData);
      setFormData({ name: "", email: "", password: "" });
      setLoader(false);
      navigate("/login"); // redirect to login after successful signup
    } catch (error) {
      console.error("Error signing up:", error);
      setLoader(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1600)`,
      }}
    >
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>

          <div className="input-box">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="terms-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="btn" disabled={loader}>
            {!loader ? "Sign Up" : <CircularProgress size={25} />}
          </button>

          <div className="register-link">
            <p>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
