// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function PrivateRoute({ children }) {
  const { user,loading } = useAuth();

   if (loading) {
    return <Loader text="Checking session..." />;
  }
  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in → show the page
  return children;
}
