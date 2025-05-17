import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/login.css";
import { AuthContext } from "./AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const baseURL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const { setLoggedIn, setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
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
      const response = await axios.post(`${baseURL}/login`, formData);
      const { token, name } = response.data;
      setToken(token);
      setLoggedIn(true);
      setUser({ name: formData.email });
      localStorage.setItem("name", JSON.stringify({ email: formData.email }));
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Error logging in:", error);
      setLoader(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1600)`,
      }}
    >
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <i className="bx bxs-user"></i>
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

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#">Forgot Password</a>
          </div>

          <button type="submit" className="btn" disabled={loader}>
            {loader ? <CircularProgress size={25} /> : "Login"}
          </button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <NavLink to="/signup">Register now</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
