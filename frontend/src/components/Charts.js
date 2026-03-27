import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { apiFetch } from "../services/api";
import "chart.js/auto";

export default function CaloriesChart() {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    apiFetch("/dashboard/chart-data").then((data) => {
      setChart({
        labels: data.labels,
        datasets: [{
          label: "Calories Burned",
          data: data.values,
          backgroundColor: "#0d6efd",
        }],
      });
    });
  }, []);

  if (!chart) return <p>Loading chart...</p>;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5>Calories (Last 7 Days)</h5>
        <Bar data={chart} />
      </div>
    </div>
  );
}


