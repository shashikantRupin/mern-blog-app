import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/login.css";
import { AuthContext } from "./AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { baseURL } from "../api";

const Login = () => {
  const { setLoggedIn, setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // inside handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/login`, formData);
      const { token, name } = response.data;

      setToken(token);
      setLoggedIn(true);
      setUser({ name: name || formData.email });

      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://i.makeagif.com/media/2-24-2021/JT4fO9.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "800px",
        display: "flex",
        marginBottom: "-140px",
        imageRendering: "auto",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <div class="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div class="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <i class="bx bxs-user"></i>
          </div>

          <div class="input-box">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <i class="bx bxs-lock-alt"></i>
          </div>

          <div class="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#">Forgot Password</a>
          </div>

          <button type="submit" class="btn">
            Login
          </button>

          <div class="register-link">
            <p>
              Dont have an account?{" "}
              <NavLink to="/signup" style={{ color: "silver" }}>
                Register now
              </NavLink>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
