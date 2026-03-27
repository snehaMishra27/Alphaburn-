import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const { login } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
      
    >
      <div
        className={`card shadow-lg p-4 w-100 ${dark ? "bg-secondary text-white" : ""}`}
        style={{ maxWidth: "450px", borderRadius: "16px" }}
        
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">AlphaBurn 🔥</h2>
          <p className={`mb-0 ${dark ? "text-light" : "text-muted"}`}>
            Welcome back! Let's get burning 💪
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${dark ? "bg-dark text-white border-secondary" : ""}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Logging in...
              </>
            ) : (
              "🔥 Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <hr className={dark ? "border-light mt-4" : "mt-4"} />

        {/* Register Link */}
        <p className="text-center mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-warning fw-semibold text-decoration-none">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;