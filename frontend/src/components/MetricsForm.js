// import { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import { apiFetch } from "../services/api";
// import "chart.js/auto";

// export default function SleepChart() {
//   const [chart, setChart] = useState(null);

//   useEffect(() => {
//     apiFetch("/dashboard/metrics-trend").then((data) => {
//       setChart({
//         labels: data.labels,
//         datasets: [{
//           label: "Sleep (hrs)",
//           data: data.sleep,
//           borderColor: "#198754",
//         }],
//       });
//     });
//   }, []);

//   if (!chart) return <p>Loading chart...</p>;

//   return (
//     <div className="card shadow-sm">
//       <div className="card-body">
//         <h5>Sleep Trend</h5>
//         <Line data={chart} />
//       </div>
//     </div>
//   );
// }


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
