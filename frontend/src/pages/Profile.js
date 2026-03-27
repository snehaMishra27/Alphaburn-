import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { dark } = useTheme();
  const { user, login } = useAuth();

  // ===== PROFILE STATE =====
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // ===== PASSWORD STATE =====
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ===== BMI + GOAL STATE =====
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(
    localStorage.getItem("weeklyGoal") || 3000
  );
  const [goalSuccess, setGoalSuccess] = useState("");

  // get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // ===== BMI CALCULATOR =====
  const calculateBMI = () => {
    if (!height || !weight) return;
    const h = Number(height) / 100; // cm to m
    const bmiVal = (Number(weight) / (h * h)).toFixed(1);
    setBmi(bmiVal);

    // BMI category
    let category = "";
    let suggestedGoal = 3000;
    if (bmiVal < 18.5) {
      category = "Underweight";
      suggestedGoal = 2000;
    } else if (bmiVal < 25) {
      category = "Normal weight";
      suggestedGoal = 3000;
    } else if (bmiVal < 30) {
      category = "Overweight";
      suggestedGoal = 3500;
    } else {
      category = "Obese";
      suggestedGoal = 4000;
    }
    setBmiCategory(category);
    setWeeklyGoal(suggestedGoal);
  };

  const saveWeeklyGoal = () => {
    localStorage.setItem("weeklyGoal", weeklyGoal);
    setGoalSuccess("Weekly goal saved! 🎯");
    setTimeout(() => setGoalSuccess(""), 2000);
  };

  // ===== UPDATE PROFILE =====
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      const res = await api.put("/auth/update-profile", { name, email });
      // update local storage user
      const updatedUser = { ...user, name, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileSuccess("Profile updated successfully! ✅");
      setTimeout(() => setProfileSuccess(""), 2000);
    } catch (err) {
      setProfileError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ===== CHANGE PASSWORD =====
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setPasswordSuccess("Password changed successfully! 🔒");
      setTimeout(() => setPasswordSuccess(""), 2000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const cardClass = `card shadow-sm mb-4 ${dark ? "bg-secondary text-white" : ""}`;
  const inputClass = `form-control ${dark ? "bg-dark text-white border-secondary" : ""}`;

  return (
    <div className={`min-vh-100 ${dark ? "bg-dark text-white" : "bg-light"}`}>
      <div className="container py-4" style={{ maxWidth: "800px" }}>

        {/* ===== PROFILE HEADER ===== */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", fontWeight: "700", color: "#fff",
              border: "3px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div>
            <h3 className="mb-0 fw-bold text-white">{user?.name || "User"}</h3>
            <small className={dark ? "text-light" : "text-muted"}>{user?.email}</small>
          </div>
        </div>

        {/* ===== UPDATE PROFILE ===== */}
        <div className={cardClass} style={{ borderRadius: "16px" }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">👤 Update Profile</h5>

            {profileSuccess && <div className="alert alert-success py-2">{profileSuccess}</div>}
            {profileError && <div className="alert alert-danger py-2">{profileError}</div>}

            <form onSubmit={handleProfileUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-warning fw-bold mt-3 px-4"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                ) : "💾 Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== BMI CALCULATOR ===== */}
        <div className={cardClass} style={{ borderRadius: "16px" }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">⚖️ BMI Calculator & Weekly Goal</h5>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Height (cm)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100" max="250"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Weight (kg)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30" max="300"
                />
              </div>
            </div>

            <button
              className="btn btn-info text-white fw-bold px-4 mb-3"
              onClick={calculateBMI}
            >
              🧮 Calculate BMI
            </button>

            {/* BMI Result */}
            {bmi && (
              <div className={`p-3 rounded mb-3 ${
                bmiCategory === "Normal weight" ? "bg-success" :
                bmiCategory === "Underweight" ? "bg-info" :
                bmiCategory === "Overweight" ? "bg-warning" : "bg-danger"
              } text-white`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 fw-bold">BMI: {bmi}</h4>
                    <small>{bmiCategory}</small>
                  </div>
                  <div className="text-end">
                    <small>Suggested weekly goal</small>
                    <h5 className="mb-0 fw-bold">{weeklyGoal} kcal</h5>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Goal Setter */}
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Weekly Calorie Goal (kcal)
                  <span className={`ms-2 fw-normal ${dark ? "text-light" : "text-muted"}`}
                    style={{ fontSize: "12px" }}>
                    (auto-filled from BMI or set manually)
                  </span>
                </label>
                <input
                  type="number"
                  className={inputClass}
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  min="500"
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-warning fw-bold w-100"
                  onClick={saveWeeklyGoal}
                >
                  🎯 Save Goal
                </button>
              </div>
            </div>
            {goalSuccess && (
              <div className="alert alert-success py-2 mt-2">{goalSuccess}</div>
            )}
          </div>
        </div>

        {/* ===== CHANGE PASSWORD ===== */}
        <div className={cardClass} style={{ borderRadius: "16px" }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">🔒 Change Password</h5>

            {passwordSuccess && <div className="alert alert-success py-2">{passwordSuccess}</div>}
            {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-danger fw-bold mt-3 px-4"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Changing...</>
                ) : "🔑 Change Password"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}