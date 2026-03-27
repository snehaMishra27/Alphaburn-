// const express = require("express");
// const router = express.Router();
// const { isAuthenticated } = require("../middleware/auth"); // your auth middleware
// const Workout = require("../models/Workout");
// const Metrics = require("../models/Metrics");

// last 7 days summary
// router.get("/summary", isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.session.user.id;

//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 7);

//     const workouts = await Workout.find({ userId, date: { $gte: last7Days } });
//     const metrics = await Metrics.find({ userId, date: { $gte: last7Days } });

//     // calories burned
//     let caloriesBurned = 0;
//     workouts.forEach(w => {
//       if (w.type === "Cardio") caloriesBurned += w.duration * 10;
//       else if (w.type === "Strength") caloriesBurned += w.duration * 8;
//       else if (w.type === "Yoga") caloriesBurned += w.duration * 5;
//       else caloriesBurned += w.duration * 6;
//     });

//     // average sleep
//     let totalSleep = metrics.reduce((sum, m) => sum + (m.sleepHours || 0), 0);
//     const avgSleep = metrics.length ? (totalSleep / metrics.length).toFixed(1) : 0;

//     // goal progress
//     const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
//     const goalProgress = Math.min(100, Math.round((totalDuration / 300) * 100));

//     res.json({ caloriesBurned, workoutCount: workouts.length, avgSleep, goalProgress });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch dashboard summary" });
//   }
// });


// const User = require("../models/User");

// router.get("/summary", isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.session.user.id;

//     // ===== 1️⃣ Prepare last 7 days =====
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date(today);
//       d.setDate(today.getDate() - i);
//       last7Days.push(d);
//     }

//     // ===== 2️⃣ Fetch workouts, metrics & user height =====
//     const workouts = await Workout.find({
//       userId,
//       date: { $gte: last7Days[0] }
//     });

//     const metrics = await Metrics.find({
//       userId,
//       date: { $gte: last7Days[0] }
//     });

    
//     // ===== 3️⃣ Calories trend =====
//     const caloriesTrend = last7Days.map(day => {
//       let calories = 0;

//       workouts.forEach(w => {
//         const wDate = new Date(w.date);
//         const sameDay =
//           wDate.getFullYear() === day.getFullYear() &&
//           wDate.getMonth() === day.getMonth() &&
//           wDate.getDate() === day.getDate();

//         if (sameDay) {
//           if (w.type === "Cardio") calories += w.duration * 10;
//           else if (w.type === "Strength") calories += w.duration * 8;
//           else if (w.type === "Yoga") calories += w.duration * 5;
//           else calories += w.duration * 6;
//         }
//       });

//       return {
//         day: day.toLocaleDateString("en-US", { weekday: "short" }),
//         calories
//       };
//     });

//     // ===== 4️⃣ Sleep trend =====
//     const sleepTrend = last7Days.map(day => {
//       let sleep = 0;

//       metrics.forEach(m => {
//         const mDate = new Date(m.date);
//         const sameDay =
//           mDate.getFullYear() === day.getFullYear() &&
//           mDate.getMonth() === day.getMonth() &&
//           mDate.getDate() === day.getDate();

//         if (sameDay && m.sleepHours) {
//           sleep = m.sleepHours;
//         }
//       });

//       return {
//         day: day.toLocaleDateString("en-US", { weekday: "short" }),
//         sleep
//       };
//     });

//     // ===== 5️⃣ Weight & BMI trend =====
//     const weightTrend = last7Days.map(day => {
//       let weight = 0;

//       metrics.forEach(m => {
//         const mDate = new Date(m.date);
//         const sameDay =
//           mDate.getFullYear() === day.getFullYear() &&
//           mDate.getMonth() === day.getMonth() &&
//           mDate.getDate() === day.getDate();

//         if (sameDay && m.weight) {
//           weight = m.weight;
//         }
//       });

//       return {
//         day: day.toLocaleDateString("en-US", { weekday: "short" }),
//         weight
//       };
//     });

//     const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
//     const goalProgress = Math.min(100, Math.round((totalDuration / 300) * 100)); // 300 min = default weekly goal

//     // ===== 6️⃣ Totals =====
//     const totalCalories = caloriesTrend.reduce((sum, d) => sum + d.calories, 0);
//     const avgSleep =
//       sleepTrend.reduce((sum, d) => sum + d.sleep, 0) / 7;

//     res.json({
//       caloriesBurned: totalCalories,
//       avgSleep: avgSleep.toFixed(1),
//       caloriesTrend,
//       sleepTrend,
//       weightTrend,
      
//     });

//   } catch (err) {
//     console.error("SUMMARY ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch dashboard summary" });
//   }
// });



// // weekly goals route
// router.get("/weekly-goals", isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.session.user.id;

//     // today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // start of today

//     // last 7 days
//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date(today);
//       d.setDate(today.getDate() - i);
//       last7Days.push(d);
//     }

//     // fetch workouts for last 7 days
//     const workouts = await Workout.find({
//       userId,
//       date: { $gte: last7Days[0] }
//     });

//     // build weekly goals array
//     const weeklyGoals = last7Days.map(day => {
//       // check if user did at least 1 workout on this day
//       const completed = workouts.some(w => {
//         const wDate = new Date(w.date);
//         return (
//           wDate.getFullYear() === day.getFullYear() &&
//           wDate.getMonth() === day.getMonth() &&
//           wDate.getDate() === day.getDate()
//         );
//       });
//       // get day name (Mon, Tue, ...)
//       const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
//       return { day: dayName, completed: completed ? 1 : 0 };
//     });

//     res.json({ weeklyGoals });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch weekly goals" });
//   }
// });

// // POST /dashboard/calculate-bmi
// // Body: { weight: number, height: number in cm }
// router.post("/calculate-bmi", isAuthenticated, async (req, res) => {
//   try {
//     const { weight, height } = req.body;

//     if (!weight || !height) {
//       return res.status(400).json({ error: "Weight and height are required" });
//     }

//     const heightMeters = height / 100;
//     const bmi = weight / (heightMeters * heightMeters);

//     res.json({ bmi: Number(bmi.toFixed(1)) });
//   } catch (err) {
//     console.error("BMI ERROR:", err);
//     res.status(500).json({ error: "Failed to calculate BMI" });
//   }
// });

// module.exports = router;


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
