import React from "react";
import styles from "../styles/about.module.css";
import { Link } from "react-router-dom";
import img1 from "../images/testi1.jpg";
import img2 from "../images/testi2.jpg";
import img3 from "../images/testi3.jpg";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const About = () => {
  const teamMember = [
    { src: img1, name: "Alexa Bliss", designation: "Product & Strategy" },
    { src: img2, name: "John Doe", designation: "Lead Architecture" },
    { src: img3, name: "Page Watson", designation: "Fullstack Engineering" },
  ];

  const values = [
    {
      icon: <LightbulbOutlinedIcon fontSize="medium" />,
      title: "Curated Innovation",
      desc: "Championing new concepts in engineering, creative design, and digital culture through clear, actionable writing.",
    },
    {
      icon: <GroupsOutlinedIcon fontSize="medium" />,
      title: "Global Community",
      desc: "Building an inclusive space where both beginner learners and experienced professionals share insights.",
    },
    {
      icon: <BoltOutlinedIcon fontSize="medium" />,
      title: "High Performance",
      desc: "Obsessed with lightning-fast load speeds, accessible reading typography, and distraction-free layouts.",
    },
    {
      icon: <SecurityOutlinedIcon fontSize="medium" />,
      title: "Editorial Integrity",
      desc: "Promoting genuine stories and verified tutorials that bring real value to our readership.",
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroBadge}>
            <AutoStoriesIcon fontSize="small" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className={styles.heroTitle}>
            Empowering Voices, <br />
            <span className={styles.heroTitleGradient}>Inspiring Readers</span>
          </h1>
          <p className={styles.heroSubtitle}>
            BlogNest is an open, modern publishing platform built to connect thinkers, developers, culinary artists, and storytellers from every corner of the globe.
          </p>
        </div>
      </section>

      {/* Mission & Purpose Grid */}
      <section className="container">
        <div className={styles.missionCard}>
          <div className={styles.missionTextCol}>
            <h2 className={styles.sectionHeading}>Why We Built BlogNest</h2>
            <p className={styles.sectionParagraph}>
              We believe great ideas shouldn't be trapped behind paywalls, intrusive ads, or complex tooling. BlogNest provides creators with clean, powerful writing workflows and provides readers with an uncluttered, high-readability experience across all devices.
            </p>
            <p className={styles.sectionParagraph}>
              Whether you're sharing an in-depth code tutorial, reviewing culinary trends, or breaking news analysis, BlogNest gives you the stage to reach an engaged audience.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container">
        <div className={styles.valuesSectionHeader}>
          <h2 className={styles.sectionHeading}>Our Core Values</h2>
          <p className={styles.sectionSubheading}>Principles that guide our engineering and editorial standards</p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <div key={i} className={styles.valueCard}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Showcase */}
      <section className="container">
        <div className={styles.teamSectionHeader}>
          <h2 className={styles.sectionHeading}>Meet the Core Team</h2>
          <p className={styles.sectionSubheading}>Passionate designers and engineers crafting this platform</p>
        </div>

        <div className={styles.teamGrid}>
          {teamMember.map((item, idx) => (
            <div key={idx} className={styles.teamCard}>
              <div className={styles.teamAvatarWrapper}>
                <img src={item.src} alt={item.name} className={styles.teamAvatar} />
              </div>
              <h3 className={styles.teamName}>{item.name}</h3>
              <p className={styles.teamRole}>{item.designation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container">
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Share Your Voice?</h2>
          <p className={styles.ctaDesc}>
            Join thousands of creators publishing on BlogNest today. It takes less than a minute to get started.
          </p>
          <div className={styles.ctaButtonGroup}>
            <Link to="/signup" className="btn-primary">
              <span>Create Free Account</span>
              <ArrowForwardIcon fontSize="small" />
            </Link>
            <Link to="/blogs" className="btn-secondary">
              <span>Explore Stories</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
