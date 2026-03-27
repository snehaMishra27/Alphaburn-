import { useState, useEffect } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Workout() {
  const { dark } = useTheme();

  const [type, setType] = useState("Cardio");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchWorkouts = async () => {
    try {
      const res = await api.get("/workout/list");
      setWorkouts(Array.isArray(res.data.workouts) ? res.data.workouts : []);
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const addWorkout = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!duration || !calories) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/workout/add", {
        type,
        duration: Number(duration),
        calories: Number(calories),   // ✅ calories now sent to backend
        date,
      });
      setSuccess("Workout added successfully! 💪");
      setTimeout(() => setSuccess(""), 2000);
      setDuration("");
      setCalories("");
      setDate(new Date().toISOString().split("T")[0]);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add workout.");
    } finally {
      setLoading(false);
    }
  };

  // Calorie estimator based on type and duration
  const estimateCalories = (workoutType, mins) => {
    const rates = {
      Cardio: 10, Strength: 8, Yoga: 4, Balance: 3,
      Squats: 7, Lunges: 7, Swimming: 11, Walking: 5, Stretching: 3,
    };
    return mins ? Math.round((rates[workoutType] || 6) * mins) : "";
  };

  const handleDurationChange = (e) => {
    const val = e.target.value;
    setDuration(val);
    // Auto-fill calories estimate when duration changes
    setCalories(estimateCalories(type, val));
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setType(val);
    setCalories(estimateCalories(val, duration));
  };

  return (
    <div className={`min-vh-100 ${dark ? "bg-dark text-white" : "bg-light"}`}>
      <div className="container py-4">

        <h2 className={`mb-4 ${dark ? "text-white" : "text-dark"}`}>➕ Add Workout</h2>

        {/* ===== FORM CARD ===== */}
        <div className={`card shadow-sm mb-5 ${dark ? "bg-secondary text-white" : ""}`}
          style={{ borderRadius: "16px" }}>
          <div className="card-body p-4">

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={addWorkout}>
              <div className="row g-3">

                {/* Date */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Workout Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Workout Type</label>
                  <select
                    className={`form-select ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Balance">Balance</option>
                    <option value="Squats">Squats</option>
                    <option value="Lunges">Lunges</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Walking">Walking</option>
                    <option value="Stretching">Stretching</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Duration (mins)</label>
                  <input
                    type="number"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    placeholder="e.g. 30"
                    value={duration}
                    onChange={handleDurationChange}
                    min="1"
                    required
                  />
                </div>

                {/* Calories */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Calories Burned 🔥
                    <span className={`ms-2 fw-normal ${dark ? "text-light" : "text-muted"}`}
                      style={{ fontSize: "12px" }}>
                      (auto-estimated, you can edit)
                    </span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
                    placeholder="e.g. 300"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    min="1"
                    required
                  />
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-warning fw-bold mt-4 px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Adding...
                  </>
                ) : "💪 Add Workout"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== WORKOUT LIST ===== */}
        <h4 className={`mb-4 ${dark ? "text-white" : "text-dark"}`}>📋 Recent Workouts</h4>
        {workouts.length === 0 ? (
          <div className={`card text-center p-4 ${dark ? "bg-secondary text-white" : ""}`}
            style={{ borderRadius: "16px" }}>
            <p className="mb-0">No workouts yet. Add your first one above! 💪</p>
          </div>
        ) : (
          <div className="row g-3">
            {workouts.slice(0,6).map((w) => (
              <div className="col-md-6 col-lg-4" key={w._id}>
                <div className={`card h-100 shadow-sm ${dark ? "bg-secondary text-white" : ""}`}
                  style={{ borderRadius: "12px" }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0 fw-bold">{w.type}</h5>
                      <span className="badge bg-warning text-dark">{w.duration} mins</span>
                    </div>
                    <p className="mb-1">
                      🔥 <strong>{w.calories || 0}</strong> kcal
                    </p>
                    <p className="mb-0 small text-muted">
                      📅 {w.date ? new Date(w.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      }) : "N/A"}
                    </p>
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

export default Workout;