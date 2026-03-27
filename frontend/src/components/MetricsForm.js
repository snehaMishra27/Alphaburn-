import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../services/api";

function SleepChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/dashboard/metrics-trend").then(res => setData(res.data));
  }, []);

  return (
    <Line
      data={{
        labels: data.map(d => d.day),
        datasets: [{
          label: "Sleep Hours",
          data: data.map(d => d.sleep)
        }]
      }}
    />
  );
}

export default SleepChart;
