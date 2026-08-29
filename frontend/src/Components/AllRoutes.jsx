import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUP";
import MyBlogs from "./MyBLogs";
import Create from "./Create";
import Blogs from "./Blogs";
import About from "./About";
import BlogDetail from "./BlogDetail";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./NotFound";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />

      {/* Protected Routes */}
      <Route
        path="/blogs"
        element={
          <PrivateRoute>
            <Blogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/blogDetail/:id"
        element={
          <PrivateRoute>
            <BlogDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/myBlogs"
        element={
          <PrivateRoute>
            <MyBlogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <Create />
          </PrivateRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
