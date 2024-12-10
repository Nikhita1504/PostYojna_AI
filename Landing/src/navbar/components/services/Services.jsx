import "./services.scss";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const variants = {
  initial: {
    x: -500,
    y: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
};

const Services = () => {
  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <motion.div
      className="services"
      variants={variants}
      initial="initial"
      ref={ref}
      animate={isInView && "animate"}
    >
      <motion.div className="textContainer" variants={variants}>
        <p>
          We focus on simplifying finances, empowering users
          <br /> to manage effectively.
        </p>
        <hr />
      </motion.div>
      <motion.div className="titleContainer" variants={variants}>
        <div className="title">
          <img src="/logo.png" alt="logo" />
          <h1>
            <motion.b whileHover={{ color: "orange" }}>Unique </motion.b>
            Features
          </h1>
        </div>
        <div className="title">
          <h1>
            <motion.b whileHover={{ color: "orange" }}>For </motion.b>You.
          </h1>
          <button>WHAT WE DO?</button>
        </div>
      </motion.div>
      <motion.div className="listContainer" variants={variants}>
        <motion.div
          className="box"
          whileHover={{ background: "lightgray", color: "black" }}
        >
          <h2>Demographic and Economic Data Visualization</h2>
          <p>
            Interactive dashboards with charts, graphs, and maps to display
            population, economic, and farming cycle data. Filters for gender,
            age, occupation, and economic activity for focused analysis.
          </p>
          <button>See more</button>
        </motion.div>

        <motion.div
          className="box"
          whileHover={{ background: "lightgray", color: "black" }}
        >
          <h2>Scheme Recommendations</h2>
          <p>
            AI-driven analysis to suggest financial and insurance schemes based
            on local demographic and economic profiles. Customized
            recommendations for services like Sukanya Samriddhi Accounts,
            Senior Citizen Social Security, and Postal Life Insurance.
          </p>
          <button>See more</button>
        </motion.div>

        <motion.div
          className="box"
          whileHover={{ background: "lightgray", color: "black" }}
        >
          <h2>Event Scheduling Tool</h2>
          <p>
            Tools for planning and scheduling outreach events like melas and
            campaigns. Automated recommendations for event timing based on
            demographic and seasonal data.
          </p>
          <button>See more</button>
        </motion.div>

        <motion.div
          className="box"
          whileHover={{ background: "lightgray", color: "black" }}
        >
          <h2>Feedback Analysis</h2>
          <p>
            NLP-based feedback feature to process voice and text feedback from
            users, enabling real-time improvements. Sentiment analysis to
            measure the effectiveness of campaigns and identify areas for
            improvement.
          </p>
          <button>See more</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Services;
