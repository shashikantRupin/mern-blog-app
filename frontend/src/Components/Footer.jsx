import "../styles/footer.css";
import {NavLink , Link} from 'react-router-dom';

const Footer =()=>{
    return (
      <footer>
        <div className="footer-container">
          <div className="sec aboutus">
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus
              quisquam minus quo illo numquam vel incidunt pariatur hic commodi
              expedita tempora praesentium at iure fugiat ea, quam laborum
              aperiam veritatis.
            </p>
            <ul className="link-container">
              <li>
                <a
                  href="https://www.linkedin.com/in/rupin-raj-d98/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-linkedin-square"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/rupin_raaz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-instagram-alt"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://shashikantrupin.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bx-globe"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="sec quicklinks">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
          <div className="sec contactBx">
            <h2>Contact Info</h2>
            <ul className="info">
              <li>
                <span>
                  <i className="bx bxs-map"></i>
                </span>
                <span>
                  {" "}
                  Civil Lines <br /> Patna <br /> india
                </span>
              </li>
              <li>
                <span>
                  <i className="bx bx-envelope"></i>
                </span>
                <p>
                  <a href="vivekverma4679@gmail.com" className="email">
                    shashikantrupin123@gmail.com
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
}
export default Footer;