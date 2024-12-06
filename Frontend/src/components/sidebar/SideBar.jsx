import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Grid,
  Menu,
  Palette,
  Users,
  Settings,
  Package,
  Map,
  FileText,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation(); // Hook to get the current route

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}><img src="/assets/logo.jpeg" alt="" /></div>
        <span className={styles.logoText}>PostYojna AI</span>
      </div>

      {/* Navigation Section */}
      <nav className={styles.nav}>
        {/* Home Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Home</h3>
          <Link
            to="/"
            className={`${styles.navItem} ${
              location.pathname === "/dashboard" ? styles.active : ""
            }`}
          >
            <Grid className={styles.icon} />
            Dashboard
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>

          <Link
            to="/demographic-insights"
            className={`${styles.navItem} ${
              location.pathname === "/menu-style" ? styles.active : ""
            }`}
          >
            <Menu className={styles.icon} />
            Demographic Insights
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/design-system"
            className={`${styles.navItem} ${
              location.pathname === "/design-system" ? styles.active : ""
            }`}
          >
            <Palette className={styles.icon} />
           Calender
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
        </div>

        {/* Pages Section */}
        {/* <div className={styles.section}>
          <h3 className={styles.sectionTitle}>PAGES</h3>
          <Link
            to="/special-pages"
            className={`${styles.navItem} ${
              location.pathname === "/special-pages" ? styles.active : ""
            }`}
          >
            <FileText className={styles.icon} />
            Special Pages
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/authentication"
            className={`${styles.navItem} ${
              location.pathname === "/authentication" ? styles.active : ""
            }`}
          >
            <Users className={styles.icon} />
            Authentication
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/users"
            className={`${styles.navItem} ${
              location.pathname === "/users" ? styles.active : ""
            }`}
          >
            <Users className={styles.icon} />
            Users
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/utilities"
            className={`${styles.navItem} ${
              location.pathname === "/utilities" ? styles.active : ""
            }`}
          >
            <Settings className={styles.icon} />
            Utilities
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
        </div> */}

        {/* Elements Section */}
        {/* <div className={styles.section}>
          <h3 className={styles.sectionTitle}>ELEMENTS</h3>
          <Link
            to="/components"
            className={`${styles.navItem} ${
              location.pathname === "/components" ? styles.active : ""
            }`}
          >
            <Package className={styles.icon} />
            Components
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/widgets"
            className={`${styles.navItem} ${
              location.pathname === "/widgets" ? styles.active : ""
            }`}
          >
            <Package className={styles.icon} />
            Widgets
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
          <Link
            to="/maps"
            className={`${styles.navItem} ${
              location.pathname === "/maps" ? styles.active : ""
            }`}
          >
            <Map className={styles.icon} />
            Maps
            <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight} />
          </Link>
        </div> */}
      </nav>
    </div>
  );
};

export default Sidebar;
