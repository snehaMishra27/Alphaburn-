import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [workoutData, setWorkoutData] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const fetchAll = async () => {
      // Fetch workouts
      try {
        const workoutRes = await api.get("/workout/list");
        setWorkoutData(Array.isArray(workoutRes.data.workouts) ? workoutRes.data.workouts : []);
      } catch (err) {
        console.error("Workout fetch error:", err);
        setError("Failed to load workout data");
      }

      // Fetch metrics separately — won't crash dashboard if this fails
      try {
        const metricsRes = await api.get("/metrics");
        setMetricsData(Array.isArray(metricsRes.data) ? metricsRes.data : []);
      } catch (err) {
        console.error("Metrics fetch error:", err);
        setMetricsData([]); // just leave empty, don't crash
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div className="text-center mt-5 text-white">Loading dashboard...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  // ===== LAST 7 DAYS FILTER =====
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const last7Workouts = workoutData.filter(item => new Date(item.date) >= sevenDaysAgo);
  const last7Metrics = metricsData.filter(item => new Date(item.date) >= sevenDaysAgo);

  // ===== TOP STATS =====
  const totalWorkouts = last7Workouts.length;
  const totalCalories = last7Workouts.reduce((acc, item) => {
    // use saved calories or estimate from duration if missing
    const cal = item.calories || Math.round((
      { Cardio: 10, Strength: 8, Yoga: 4, Balance: 3,
        Squats: 7, Lunges: 7, Swimming: 11, Walking: 5, Stretching: 3 }
      [item.type] || 6) * item.duration);
    return acc + Number(cal);
  }, 0);
  const weeklyGoal = Number(localStorage.getItem("weeklyGoal")) || 3000;
  const progressPercent = Math.min((totalCalories / weeklyGoal) * 100, 100).toFixed(0);

  // ===== CHART DATA — full 7 day loop =====
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    const workout = last7Workouts.find(item =>
      new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) === label
    );

    const metric = last7Metrics.find(item =>
      new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) === label
    );

    // estimate calories for old workouts that dont have calories field
    const calories = workout
      ? workout.calories || Math.round((
          { Cardio: 10, Strength: 8, Yoga: 4, Balance: 3,
            Squats: 7, Lunges: 7, Swimming: 11, Walking: 5, Stretching: 3 }
          [workout.type] || 6) * workout.duration)
      : 0;

    chartData.push({
      date: label,
      calories: Number(calories),
      sleep: metric ? Number(metric.sleepDuration || metric.sleepHours || 0) : 0,
      weight: metric ? Number(metric.weight || 0) : 0,
    });
  }

  return (
    <div>
      <div className="container pt-4 pb-5 fade-in">

        {/* ===== HEADER ROW ===== */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="mb-0 text-white">Hey {user?.name?.split(" ")[0] || "Champ"},Here's your Fitness Dashboard 💪</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-warning btn-sm fw-semibold"
              onClick={() => navigate("/workout")}
            >
              ➕ Add Workout
            </button>
            <button
              className="btn btn-info btn-sm fw-semibold text-white"
              onClick={() => navigate("/metrics")}
            >
              📊 Add Metrics
            </button>
          </div>
        </div>

        {/* ===== TOP STATS ===== */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className={`card h-100 text-center shadow-sm ${dark ? "bg-secondary text-white" : ""}`}>
              <div className="card-body">
                <h5 className="card-title">Total Workouts</h5>
                <h3 className="fw-bold">{totalWorkouts}</h3>
                <small className="text-muted">Last 7 days</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className={`card h-100 text-center shadow-sm ${dark ? "bg-secondary text-white" : ""}`}>
              <div className="card-body">
                <h5 className="card-title">Calories Burned</h5>
                <h3 className="fw-bold">{totalCalories} kcal</h3>
                <small className="text-muted">Last 7 days</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className={`card h-100 text-center shadow-sm ${dark ? "bg-secondary text-white" : ""}`}>
              <div className="card-body">
                <h5 className="card-title">Weekly Goal</h5>
                <div className="progress mt-3" style={{ height: "20px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {progressPercent}%
                  </div>
                </div>
                <small className="mt-2 d-block text-muted">
                  {totalCalories} / {weeklyGoal} kcal
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CHARTS ===== */}
        <div className="row g-4">

          {/* Calories Bar Chart */}
          <div className="col-md-6">
            <div className={`card shadow-sm ${dark ? "bg-secondary text-white" : ""}`}>
              <div className="card-body">
                <h5 className="text-center mb-3">Weekly Calories 🔥</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#aaa" : "#ccc"} />
                    <XAxis dataKey="date" stroke={dark ? "#fff" : "#000"} tick={{ fontSize: 12 }} />
                    <YAxis stroke={dark ? "#fff" : "#000"} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value} kcal`, "Calories Burned"]}
                      contentStyle={{
                        background: dark ? "#333" : "#fff",
                        color: dark ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="calories" fill="#ff5722" radius={[8, 8, 0, 0]} name="Calories Burned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sleep + Weight Line Chart */}
          <div className="col-md-6">
            <div className={`card shadow-sm ${dark ? "bg-secondary text-white" : ""}`}>
              <div className="card-body">
                <h5 className="text-center mb-0">Weekly Trends 💤⚖️</h5>

                {/* Legend */}
                <div className="d-flex justify-content-center gap-3">
                  <span style={{ fontSize: "13px" }}>
                    <span style={{
                      display: "inline-block", width: "12px", height: "12px",
                      background: "#3385FF", borderRadius: "50%", marginRight: "5px"
                    }}></span>
                    Sleep (hrs)
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    <span style={{
                      display: "inline-block", width: "12px", height: "12px",
                      background: "#FF5722", borderRadius: "50%", marginRight: "5px"
                    }}></span>
                    Weight (kg)
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#aaa" : "#ccc"} />
                    <XAxis dataKey="date" stroke={dark ? "#fff" : "#000"} tick={{ fontSize: 12 }} />
                    <YAxis stroke={dark ? "#fff" : "#000"} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: dark ? "#333" : "#fff",
                        color: dark ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#3385FF"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                      name="Sleep (hrs)"
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#FF5722"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                      name="Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;