// // // src/context/AuthContext.jsx
// // import { createContext, useState, useEffect } from "react";
// // import axios from "axios";

// // export const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // Check if user is already logged in
// //   useEffect(() => {
// //     axios
// //       .get("http://localhost:5000/auth/me", { withCredentials: true })
// //       .then((res) => {
// //         setUser(res.data.user);
// //         setLoading(false);
// //       })
// //       .catch(() => {
// //         setUser(null);
// //         setLoading(false);
// //       });
// //   }, []);

// //   // Login function
// //   const login = async (email, password) => {
// //     const res = await axios.post(
// //       "http://localhost:5000/auth/login",
// //       { email, password },
// //       { withCredentials: true }
// //     );
// //     setUser(res.data.user);
// //   };

// //   // Logout function
// //   const logout = async () => {
// //     await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, logout, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }


// import React, { createContext, useContext, useEffect, useState } from "react";
// import { apiFetch } from "../services/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔁 refresh / page reload pe session check
//   useEffect(() => {
//     apiFetch("/auth/me")
//       .then((data) => setUser(data.user))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   const login = async (email, password) => {
//     const data = await apiFetch("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });
//     setUser(data.user);
//   };

//   const register = async (payload) => {
//     const data = await apiFetch("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     });
//     setUser(data.user);
//   };

//   const logout = async () => {
//     await apiFetch("/auth/logout", { method: "POST" });
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// //export const useAuth = () => useContext(AuthContext);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return context;
// };

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

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
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    return res.data;
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    return res.data;
  };

  // Logout
  const logout = () => {
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
