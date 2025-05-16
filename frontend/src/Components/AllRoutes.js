import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUP";
import MyBlogs from "./MyBLogs";
import Create from "./Create";
import Blogs from "./Blogs";
import About from "./About";
import Contact from "./Contact";
import BlogDetail from "./BlogDetail";
import PrivateRoute from "./PrivateRoute";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/blogDetail/:id" element={<PrivateRoute><BlogDetail/></PrivateRoute>} />

      {/* Private Routes */}
      <Route
        path="/blogs"
        element={
          <PrivateRoute>
            <Blogs />
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

      {/* Optional routes (uncomment if needed) */}
      {/* <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} /> */}
    </Routes>
  );
};

export default AllRoutes;
