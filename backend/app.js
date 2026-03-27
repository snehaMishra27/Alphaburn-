require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const dashboardRouter = require("./routes/dashboard");
const metricsRoutes = require("./routes/metrics");
const authRouter = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
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
      secure:false
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
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));


// 🔹 production frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend/build/index.html")
    );
  });
}

module.exports = app;
