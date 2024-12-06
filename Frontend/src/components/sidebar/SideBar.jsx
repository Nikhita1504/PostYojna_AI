import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Dashboard, Menu, Palette } from "@mui/icons-material"; // Valid Material UI icons
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <img src="/assets/logo.jpeg" alt="Logo" />
        </div>
        <span className={styles.logoText}>PostYojna AI</span>
      </div>

      <div className={styles.Profile}>
        <img src="/assets/user.jpeg" alt="" />
        <div>
        <h4>Rahul Vyas</h4>
        <p>Branch Manager</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className={styles.nav}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Home</h3>
          <Link
            to="/"
            className={`${styles.navItem} ${
              location.pathname === "/" ? styles.active : ""
            }`}
            id={styles.dashboard}
          >
            <Dashboard className={styles.icon} />
            Dashboard
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>

          <Link
            to="/demographic-insights"
            className={`${styles.navItem} ${
              location.pathname === "/demographic-insights" ? styles.active : ""
            }`}
          >
            <Menu className={styles.icon} />
            Demographic Insights
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/calendar"
            className={`${styles.navItem} ${
              location.pathname === "/calendar" ? styles.active : ""
            }`}
          >
            <Palette className={styles.icon} />
            Calendar
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
