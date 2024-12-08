import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCalendarAlt, faChartPie, faHome } from "@fortawesome/free-solid-svg-icons";
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
            to="/Home/Dashboard"
            className={`${styles.navItem} ${location.pathname === "/Home/Dashboard" ? styles.active : ""
              }`}
            id={styles.dashboard}
          >
            <FontAwesomeIcon icon={faHome} className={styles.icon} />
            Dashboard
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <h3 className={styles.sectionTitle}>Visualizations</h3>

          <Link
            to="/Home/demographic-insights"
            className={`${styles.navItem} ${["/Home/demographic-insights", "/Home/demographic-insights/maps", "/Home/demographic-insights/maps/graphs"].includes(location.pathname)
                ? styles.active
                : ""
              }`}
          >
            <FontAwesomeIcon icon={faChartPie} className={styles.icon} />
            Demographic Insights
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>

          <h3 className={styles.sectionTitle}>Add Event</h3>
          <Link
            to="/Home/calendar"
            className={`${styles.navItem} ${location.pathname === "/Home/calendar" ? styles.active : ""
              }`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
            Calendar
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <h3 className={styles.sectionTitle}>Suggestions</h3>

          <Link
            to="/Home/Feedback"
            className={`${styles.navItem} ${location.pathname === "/Home/Feedback" ? styles.active : ""
              }`}
          >
            <Menu className={styles.icon} />
            Feedback
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
