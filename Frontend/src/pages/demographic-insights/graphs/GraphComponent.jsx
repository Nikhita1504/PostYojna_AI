import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import styles from "./GraphComponent.module.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function GraphComponent() {
  // Example data for graphs
  const populationData = {
    labels: ["Male Population", "Female Population"],
    datasets: [
      {
        data: [1271, 1265],
        backgroundColor: ["#4CAF50", "#00BCD4"],
        hoverBackgroundColor: ["#388E3C", "#00838F"],
      },
    ],
  };

  const ageGroupData = {
    labels: ["0-10", "11-18", "19-59", "60+"],
    datasets: [
      {
        label: "Male",
        data: [100, 150, 750, 50],
        backgroundColor: "#4CAF50",
      },
      {
        label: "Female",
        data: [90, 120, 700, 70],
        backgroundColor: "#00BCD4",
      },
    ],
  };

  const occupationData = {
    labels: [
      "Agricultural Labourers",
      "Marginal Agricultural Labourers",
      "Main Household Industries",
      "Marginal Household Industries",
      "Other Workers Population",
      "Non-working Population",
    ],
    datasets: [
      {
        label: "Value",
        data: [350, 200, 150, 100, 400, 1400],
        backgroundColor: "#FFC107",
      },
    ],
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphCard1}>
        <Doughnut data={populationData} />
        <p>Population Based Chart</p>

      </div>

      <div className={styles.graphCard}>
        <Bar data={ageGroupData} options={{ responsive: true }} />
        <p>Age Groups Based Chart</p>

      </div>

      <div className={`${styles.graphCard} ${styles.fullWidth}`}>

        <Bar data={occupationData} options={{ responsive: true }} />
        <p>Occupation Based Chart</p>

      </div>
    </div>
  );
}

export default GraphComponent;
