const express = require("express");
const router = express.Router();

const Workout = require("../models/Workout");
const Metrics = require("../models/Metrics");
const isAuthenticated = require("../middleware/auth");

/* =========================
   GET /dashboard/summary
========================= */
router.get("/summary", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(d);
    }

    const workouts = await Workout.find({
      userId,
      date: { $gte: last7Days[0] }
    });

    const metrics = await Metrics.find({
      userId,
      date: { $gte: last7Days[0] }
    });

    const caloriesTrend = last7Days.map(day => {
      let calories = 0;

      workouts.forEach(w => {
        const wd = new Date(w.date);
        if (
          wd.getFullYear() === day.getFullYear() &&
          wd.getMonth() === day.getMonth() &&
          wd.getDate() === day.getDate()
        ) {
          if (w.type === "Cardio") calories += w.duration * 10;
          else if (w.type === "Strength") calories += w.duration * 8;
          else if (w.type === "Yoga") calories += w.duration * 5;
          else calories += w.duration * 6;
        }
      });

      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        calories
      };
    });

    const sleepTrend = last7Days.map(day => {
      let sleep = 0;

      metrics.forEach(m => {
        const md = new Date(m.date);
        if (
          md.getFullYear() === day.getFullYear() &&
          md.getMonth() === day.getMonth() &&
          md.getDate() === day.getDate()
        ) {
          sleep = m.sleepHours || 0;
        }
      });

      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        sleep
      };
    });

    const weightTrend = last7Days.map(day => {
      let weight = 0;

      metrics.forEach(m => {
        const md = new Date(m.date);
        if (
          md.getFullYear() === day.getFullYear() &&
          md.getMonth() === day.getMonth() &&
          md.getDate() === day.getDate()
        ) {
          weight = m.weight || 0;
        }
      });

      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        weight
      };
    });

    const totalCalories = caloriesTrend.reduce((s, d) => s + d.calories, 0);
    const avgSleep =
      sleepTrend.reduce((s, d) => s + d.sleep, 0) / 7;

    res.json({
      caloriesBurned: totalCalories,
      avgSleep: avgSleep.toFixed(1),
      caloriesTrend,
      sleepTrend,
      weightTrend
    });

  } catch (err) {
    console.error("DASHBOARD SUMMARY ERROR:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

/* =========================
   GET /dashboard/weekly-goals
========================= */
router.get("/weekly-goals", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(d);
    }

    const workouts = await Workout.find({
      userId,
      date: { $gte: last7Days[0] }
    });

    const weeklyGoals = last7Days.map(day => {
      const done = workouts.some(w => {
        const wd = new Date(w.date);
        return (
          wd.getFullYear() === day.getFullYear() &&
          wd.getMonth() === day.getMonth() &&
          wd.getDate() === day.getDate()
        );
      });

      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        completed: done ? 1 : 0
      };
    });

    res.json({ weeklyGoals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weekly goals error" });
  }
});

/* =========================
   POST /dashboard/calculate-bmi
========================= */
router.post("/calculate-bmi", isAuthenticated, async (req, res) => {
  const { weight, height } = req.body;

  if (!weight || !height) {
    return res.status(400).json({ error: "Weight and height required" });
  }

  const h = height / 100;
  const bmi = weight / (h * h);

  res.json({ bmi: Number(bmi.toFixed(1)) });
});

// 📊 Calories / duration in last 7 days (Bar Chart)
router.get("/chart-data", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    const workouts = await Workout.find({
      userId,
      date: { $gte: startDate }
    });

    // Prepare last 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const values = days.map(day => {
      return workouts
        .filter(w => w.date.toISOString().split("T")[0] === day)
        .reduce((sum, w) => sum + w.duration, 0);
    });

    res.json({
      labels: days,
      values
    });
  } catch (err) {
    console.error("chart-data error:", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});


// 📈 Metrics trend (example: duration trend)
router.get("/metrics-trend", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const workouts = await Workout.find({ userId })
      .sort({ date: 1 })
      .limit(20);

    res.json({
      trend: workouts.map(w => ({
        date: w.date,
        value: w.duration
      }))
    });
  } catch (err) {
    console.error("metrics-trend error:", err);
    res.status(500).json({ error: "Failed to fetch metrics trend" });
  }
});


module.exports = router;
