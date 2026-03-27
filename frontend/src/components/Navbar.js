// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const [darkMode, setDarkMode] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // simple auth demo
//     navigate("/login");
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   useEffect(() => {
//     document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   }, [darkMode]);

//   return (
//     <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/dashboard">
//           Alphaburn
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/dashboard">
//                 Dashboard
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/workouts">
//                 Workouts
//               </Link>
//             </li>
//           </ul>
//           <div className="d-flex align-items-center">
//             <div className="form-check form-switch me-3">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="darkModeSwitch"
//                 checked={darkMode}
//                 onChange={toggleDarkMode}
//               />
//               <label className="form-check-label" htmlFor="darkModeSwitch">
//                 Dark Mode
//               </label>
//             </div>
//             <button className="btn btn-outline-danger" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



// // import { Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function Navbar() {
// //   const { logout } = useAuth();

// //   return (
// //     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
// //       <Link className="navbar-brand fw-bold" to="/">
// //         🔥 AlphaBurn
// //       </Link>

// //       <div className="collapse navbar-collapse show">
// //         <ul className="navbar-nav me-auto">
// //           <li className="nav-item">
// //             <Link className="nav-link" to="/dashboard">Dashboard</Link>
// //           </li>
// //           <li className="nav-item">
// //             <Link className="nav-link" to="/workouts">Workouts</Link>
// //           </li>
// //         </ul>

// //         <button className="btn btn-outline-danger" onClick={logout}>
// //           Logout
// //         </button>
// //       </div>
// //     </nav>
// //   );
// // }

// // import { useContext, useState } from "react";
// // import { Link } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext";

// // function Navbar() {
// //   const { user, logout } = useContext(AuthContext);
// //   const [dark, setDark] = useState(false);

// //   const toggleTheme = () => {
// //     setDark(!dark);
// //     document.body.className = dark ? "light-theme" : "dark-theme";
// //   };

// //   return (
// //     <nav className="navbar navbar-expand-lg navbar-dark px-4">
// //       <Link className="navbar-brand fw-bold" to="/">⚡AlphaBurn</Link>

// //       <div className="ms-auto d-flex align-items-center gap-3">
// //         <button onClick={toggleTheme} className="btn btn-outline-light">
// //           {dark ? "☀ Light" : "🌙 Dark"}
// //         </button>

// //         {user && (
// //           <button onClick={logout} className="btn btn-danger">
// //             Logout
// //           </button>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;

//import { useContext } from "react";
// import { useTheme } from "../context/ThemeContext";
// import { Link } from "react-router-dom";

// function Navbar() {
//   const { dark, toggleTheme } = useTheme();
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container">
//         {/* <Link className="navbar-brand" to="/dashboard">
//           AlphaBurn 💪
//         </Link> */}
//           <span className="navbar-brand fw-bold text-white fs-4">
//             AlphaBurn 🔥
//           </span>
        
//         <div>
//           <Link className="btn btn-outline-light" to="/workout">
//             Add Workouts
//           </Link>
//           <Link className="btn btn-outline-light" to="/metrics">
//             Add Metrics
//           </Link>

          
//         </div>
//         {/* <button
//             className="btn btn-outline-light btn-sm"
//             onClick={toggleTheme}
//           >
//             {dark ?  "🌙 Dark":"☀ Light" }
//           </button> */}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



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



