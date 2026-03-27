import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { user } = useAuth();
  // get initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand fw-bold fs-4">AlphaBurn 🔥</span>

        <div className="ms-auto d-flex align-items-center gap-3 me-2">
          {/* Profile Icon */}
          <Link
            to="/profile"
            className="text-decoration-none"
            title="Profile & Settings"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "700",
                color: "#fff",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {getInitials(user?.name)}
            </div>
          </Link>
          {/* <Link className="btn btn-outline-light btn-sm" to="/workout">
            Add Workouts
          </Link>
          <Link className="btn btn-outline-light btn-sm" to="/metrics">
            Add Metrics
          </Link> */}

          {/* Toggle Switch */}
          <div className="form-check form-switch mb-0 d-flex align-items-center gap-2">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="themeSwitch"
              checked={dark}
              onChange={toggleTheme}
              style={{ width: "2.5em", height: "1.3em", cursor: "pointer" }}
            />
            <label
              className="form-check-label text-white mb-0"
              htmlFor="themeSwitch"
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;



