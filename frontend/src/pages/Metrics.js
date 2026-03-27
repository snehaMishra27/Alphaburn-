// import { useState } from "react";
// import api from "../services/api";

// function Metrics() {
//   const [weight, setWeight] = useState("");
//   const [sleepHours, setSleepHours] = useState("");
//   const [metrics, setMetrics] = useState([]); // ✅ must be []


//   const addMetrics = async (e) => {
//     e.preventDefault();
//     await api.post("/metrics/add", { weight, sleepHours });
//     alert("Metrics added");
  
//   // Optional: add locally for instant display
//     setMetrics([
//       ...metrics,
//       { _id: Date.now(), name: "Weight", value: weight },
//       { _id: Date.now() + 1, name: "Sleep Hours", value: sleepHours },
//     ]);

//     // Clear inputs
//     setWeight("");
//     setSleepHours("");
//   };
//   return (
//     <div>
//       <h3>Add Metrics</h3>

//       <form onSubmit={addMetrics}>
//         <input
//           className="form-control mb-2"
//           placeholder="Weight"
//           onChange={(e) => setWeight(e.target.value)}
//         />
//         <input
//           className="form-control mb-2"
//           placeholder="Sleep Hours"
//           onChange={(e) => setSleepHours(e.target.value)}
//         />
//         <button className="btn btn-primary">Save</button>
//       </form>
//       {/* Display list of metrics */}
//       <ul className="list-group mt-3">
//         {metrics.map((m) => (
//           <li
//             key={m._id}
//             className="list-group-item d-flex justify-content-between align-items-center"
//           >
//             {m.name}
//             <span className="badge bg-primary rounded-pill">{m.value}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

// }
// export default Metrics;


// import { useState, useEffect } from "react";
// import api from "../services/api";

// function Metrics() {
//   const [weight, setWeight] = useState("");
//   const [sleepHours, setSleepHours] = useState("");
//   const [metrics, setMetrics] = useState([]);

//   // ✅ Fetch metrics when page loads
//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const res = await api.get("/metrics"); // make sure this route exists
//         setMetrics(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMetrics();
//   }, []);

//   const addMetrics = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/metrics/add", { weight, sleepHours });

//       // Add new metric to list instantly
//       setMetrics([...metrics,{ _id: Date.now(), weight, sleepHours }]);

//       setWeight("");
//       setSleepHours("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h3>Add Metrics</h3>

//       <form onSubmit={addMetrics}>
//         <input
//           className="form-control mb-2"
//           placeholder="Weight"
//           value={weight}
//           onChange={(e) => setWeight(e.target.value)}
//         />
//         <input
//           className="form-control mb-2"
//           placeholder="Sleep Hours"
//           value={sleepHours}
//           onChange={(e) => setSleepHours(e.target.value)}
//         />
//         <button className="btn btn-primary">Save</button>
//       </form>

//       {/* Styled like workout list */}
//       <ul className="list-group mt-3">
//         {metrics.map((m) => (
//           <li key={m._id} className="list-group-item">
//             Weight: {m.weight} kg - Sleep: {m.sleepHours} hrs
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Metrics;


import { useState, useEffect } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Metrics() {
  const { dark } = useTheme();

  const [weight, setWeight] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMetrics = async () => {
    try {
      const res = await api.get("/metrics");
      setMetrics(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const addMetrics = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!weight || !sleepDuration) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/metrics/add", {
        weight: Number(weight),
        sleepDuration: Number(sleepDuration),  // ✅ matches Dashboard field name
        date,
      });
      setSuccess("Metrics saved successfully! 📊");
      setTimeout(() => setSuccess(""), 2000); 
      setWeight("");
      setSleepDuration("");
      setDate(new Date().toISOString().split("T")[0]);
      fetchMetrics();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save metrics.");
      setTimeout(() => setError(""), 2000); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-vh-100 ${dark ? "bg-dark text-white" : "bg-light"}`}>
      <div className="container py-4">

        <h2 className={`mb-4 ${dark ? "text-white" : "text-dark"}`}>📊 Add Metrics</h2>

        {/* ===== FORM CARD ===== */}
        <div
          className={`card shadow-sm mb-5 ${dark ? "bg-secondary text-white" : ""}`}
          style={{ borderRadius: "16px" }}
        >
          <div className="card-body p-4">

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={addMetrics}>
              <div className="row g-3">

                {/* Date */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Weight */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Weight (kg) ⚖️</label>
                  <input
                    type="number"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="1"
                    step="0.1"
                    required
                  />
                </div>

                {/* Sleep Duration */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Sleep Hours 💤</label>
                  <input
                    type="number"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    placeholder="e.g. 7"
                    value={sleepDuration}
                    onChange={(e) => setSleepDuration(e.target.value)}
                    min="1"
                    max="24"
                    step="0.5"
                    required
                  />
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-info fw-bold mt-4 px-4 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Saving...
                  </>
                ) : "💾 Save Metrics"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== METRICS LIST ===== */}
        <h4 className={`mb-4 ${dark ? "text-white" : "text-dark"}`}>📋 Recent Metrics</h4>
        {metrics.length === 0 ? (
          <div
            className={`card text-center p-4 ${dark ? "bg-secondary text-white" : ""}`}
            style={{ borderRadius: "16px" }}
          >
            <p className="mb-0">No metrics yet. Add your first entry above! 📊</p>
          </div>
        ) : (
          <div className="row g-3">
            {metrics.slice(0,6).map((m) => (
              <div className="col-md-6 col-lg-4" key={m._id}>
                <div
                  className={`card h-100 shadow-sm ${dark ? "bg-secondary text-white" : ""}`}
                  style={{ borderRadius: "12px" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0 fw-bold">📅 {m.date
                        ? new Date(m.date).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "N/A"}
                      </h5>
                    </div>
                    <p className="mb-1">⚖️ <strong>{m.weight}</strong> kg</p>
                    <p className="mb-0">💤 <strong>{m.sleepDuration}</strong> hrs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Metrics;