import React from "react";
import styles from "../styles/about.module.css";
import img1 from "../images/testi1.jpg";
import img3 from "../images/testi3.jpg";
import img2 from "../images/testi2.jpg";

const About = () => {
  const teamMember = [
    { src: img1, name: "alexa bliss", deignation: "product manager" },
    { src: img2, name: "john doe", deignation: "Lead Developer" },
    { src: img3, name: "page watson", deignation: "fullstack Developer" },
  ];
  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Welcome to Our App</h1>
        <p>Empowering creators worldwide to share their stories.</p>
      </section>

      {/* Mission Statement */}
      <section className={styles.mission}>
        <h2>Our Mission</h2>
        <p>
          To provide creators with intuitive tools that simplify content
          creation and foster innovation and collaboration.
        </p>
      </section>

      {/* Team Introduction */}
      <section className={styles.team}>
        <h2>Meet the Team</h2>
        <div className={styles.teamMembers}>
          {teamMember?.map((item ,idx) => (
            <div className={styles.member}>
              <img src={item?.src} alt="Jane Doe" />
              <h3>{item.name}</h3>
              <p>{item.deignation}</p>
            </div>
          ))}
          {/* Add more team members as needed */}
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.values}>
        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Innovation:</strong> Continuously improving to meet user
            needs.
          </li>
          <li>
            <strong>Community:</strong> Building a supportive and inclusive
            environment.
          </li>
          <li>
            <strong>Integrity:</strong> Upholding transparency and
            trustworthiness.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2>Join Our Community</h2>
        <a href="/signup" className={styles.ctaButton}>
          Get Started
        </a>
      </section>
    </div>
  );
};

export default About;
