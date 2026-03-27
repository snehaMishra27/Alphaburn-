// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./components/PrivateRoute";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//           {/* Private Dashboard */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />

//           {/* Default route */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Workouts from "./pages/Workouts";
// import PrivateRoute from "./components/PrivateRoute";
// import { AuthProvider } from "./context/AuthContext";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/workouts"
//             element={
//               <PrivateRoute>
//                 <Workouts />
//               </PrivateRoute>
//             }
//           />

//           <Route path="*" element={<Login />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Workouts from "./pages/Workouts";
// import PrivateRoute from "./components/PrivateRoute";
// import { AuthProvider } from "./context/AuthContext";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route
//             path="/"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/workouts"
//             element={
//               <PrivateRoute>
//                 <Workouts />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workouts";
import Metrics from "./pages/Metrics";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Profile from "./pages/Profile";
function App() {
  return (
    <ThemeProvider>
    <AuthProvider> 
    <Router>
      <div className="d-flex flex-column min-vh-100">  {/* 👈 wrap everything */}
        
        <Navbar />

        <main className="flex-grow-1">          {/* 👈 this pushes footer down */}
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>

        <Footer />                              {/* 👈 always at bottom */}

      </div>
    </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}
// function App() {
//   return (
//     <Router>
//     <div className="d-flex flex-column min-vh-100">
//       <Navbar />
//       <div className="container mt-4">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/workout" element={<Workout />} />
//           <Route path="/metrics" element={<Metrics />} />
          
//         </Routes>
//       </div>
//       </div>
//     </Router>
//   );
// }

export default App;
