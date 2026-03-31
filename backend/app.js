require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const dashboardRouter = require("./routes/dashboard");
const metricsRoutes = require("./routes/metrics");
const authRouter = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const app = express();
//"http://localhost:3000"
// middleware
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL  // e.g. https://yourapp.onrender.com
    : "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      //secure:false
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// routes (empty for now)
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/workout", workoutRoutes);
app.use("/metrics", metricsRoutes);



// db + server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on ${PORT}`)
    );
  })
  .catch(err => console.error(err));


// 🔹 production frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..frontend/build")));

  app.get("/{*path}", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..frontend/build/index.html")
    );
  });
}

module.exports = app;
