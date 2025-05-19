import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../styles/myBlog.css"; 
import { confirmAlert } from "react-confirm-alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const baseURL = process.env.REACT_APP_BASE_URL;

const Blogs = () => {
  const { token } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const[userInfo, setUserInfo]=useState({})
  const { confirmAction } = useContext(AuthContext);

  const fetchBlogs = async (type="",user) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/blogs?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter blogs by auth_email matching the logged-in user's email
      const filteredBlogs = response?.data?.filter(
        (blog) => blog.auth_email === user?.email
      );
      console.log("filteredBlogs123",response?.data);
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("email"));
    fetchBlogs(type,user);
  }, [token, type]);

  const justfetch = () => {
    setType("");
  };

  const onlytech = () => {
    setType("tech");
  };

  const onlyFood = () => {
    setType("food");
  };

  const onlyNews = () => {
    setType("news");
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmAction(
      "Confirm Deletion",
      "Are you sure you want to delete this blog?"
    );

    if (!isConfirmed) return;

    try {
    const res=  await axios.delete(`${baseURL}/blogs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
     
      });
      if (res.status == 200 || res.status==201) {
        fetchBlogs()
        alert("Blog deleted successfully.");
      }
      // Optionally, refresh the blog list or navigate as needed
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };
  
  const isSingleItem = blogs.length === 1;

  return (
    <div>
      <div className="filter-box container">
        <span
          className="filter-item"
          onClick={justfetch}
          id={type === "" ? "active-filter" : ""}
        >
          All
        </span>
        <span
          className="filter-item"
          onClick={onlytech}
          id={type === "tech" ? "active-filter" : ""}
        >
          Tech
        </span>
        <span
          className="filter-item"
          onClick={onlyFood}
          id={type === "food" ? "active-filter" : ""}
        >
          Food
        </span>
        <span
          className="filter-item"
          onClick={onlyNews}
          id={type === "news" ? "active-filter" : ""}
        >
          News
        </span>
      </div>

      <h2 className="your-blogs-heading">Your Blogs</h2>

      <div
        className={`${
          isSingleItem ? "single-item-container" : "blogs-list-container"
        }`}
      >
        {!loading ? (
          blogs?.map((blog) => (
            <div
              key={blog._id}
              className={`blog-card ${isSingleItem ? "single-item" : ""}`}
            >
              <Link to={`/blogDetail/${blog._id}`}>
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="blog-image"
                />
              </Link>
              <div className="blog-info">
                <h3> Title :{blog.title}</h3>
                <p>Type: {blog.type}</p>
                <p>{blog.content}</p>
                <p>Author: {blog.auth_email}</p>

                <div className="button-container" align="right">
                  <Link to={`/blogDetail/${blog._id}`}>
                    <button className="edit-btn">
                      Edit
                      <EditIcon className="icon-edit" />
                    </button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      handleDelete(blog._id);
                    }}
                  >
                    Delete
                    <DeleteIcon className="icon-delete" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <img
            src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1260.gif"
            alt="load"
            className="loader"
          />
        )}

        {blogs?.length === 0 && !loading ? (
          <div className="no-blog">
            <img
              src="https://cdn.dribbble.com/users/95510/screenshots/1694572/no-chat_gif.gif"
              alt="no blogs"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Blogs;
