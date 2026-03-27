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


export default App;
