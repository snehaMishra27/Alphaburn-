import { createContext, useContext, useState, useEffect } from "react";
//import api from "../services/api";
import {loginUser,registerUser,logoutUser} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register
  const register = async (name, email, password) => {
    //const res = await api.post("/auth/register", { name, email, password });
    const data = await registerUser(name,email,password);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    return data;
  };

  // Login
  const login = async (email, password) => {
    //const res = await api.post("/auth/login", { email, password });
    const data = await loginUser(email, password);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    return data;
  };

  // Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
