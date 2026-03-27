
// const API_BASE = "http://localhost:5000";

// export const apiFetch = async (url, options = {}) => {
//   const response = await fetch(`${API_BASE}${url}`, {
//     credentials: "include", // session cookie
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   // read response ONCE
//   const text = await response.text();

//   let data;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     throw new Error("Server did not return JSON");
//   }

//   // handle auth failure cleanly
//   if (response.status === 401) {
//     throw new Error("Unauthorized");
//   }

//   if (!response.ok) {
//     throw new Error(data.error || data.message || "Something went wrong");
//   }

//   return data;
// };


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend URL
  withCredentials: true
});

export default api;
