import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../styles/blogs.css"

const baseURL = process.env.REACT_APP_BASE_URL;
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const { token ,getTime} = useContext(AuthContext);

  const fetchBlogs = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/blogs?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(response?.data);
      // console.log(response?.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(type);
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

      
        <div style={{ marginTop: "20px" }} className="latest-blog-header">
          Latest <span style={{ color: "blueViolet" }}> Blogs </span>
        </div>
      

      <div className="post container">
        {!loading ? (
          blogs?.map((blog) => (
            <div className="post-box" key={blog._id}>
              <img src={blog.imageUrl} alt="" className="post-img" />
              <h2 className="category">{blog.type}</h2>
              <Link to={`/blogDetail/${blog._id}`}>
                <h3 className="post-title">{blog.title}</h3>
              </Link>
              <span className="post-date">{getTime(blog?.createdAt)}</span>
              <p className="post-description">
                {blog?.content}
              </p>
              <div className="profile">
                <img
                  src="https://pics.craiyon.com/2023-07-15/32c89c16131e490ab3536dc2e91bccb3.webp"
                  alt=""
                  className="profile-img"
                />
                <span className="profile-name">Shashikant</span>
              </div>
            </div>
          ))
        ) : (
          <img
            src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1260.gif"
            alt="load"
            style={{ width: "250px" }}
          />
        )}

        {blogs.length === 0 ? (
          <img src="https://cdn.dribbble.com/users/95510/screenshots/1694572/no-chat_gif.gif" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Blogs;
