// const express = require("express");
// const router = express.Router();
// const isAuthenticated = require("../middleware/auth");
// const Workout = require("../models/Workout");

// router.post("/add", isAuthenticated, async (req, res) => {
//   try {
//     const { type, duration, date } = req.body;

//     if (!type || !duration) {
//       return res.status(400).json({ error: "Type and duration required" });
//     }

//     // Ensure session user exists
//     if (!req.session || !req.session.user || !req.session.user.id) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }


//     const workout = new Workout({
//       userId: req.session.user.id,
//       type,
//       duration,
//       date: date ? new Date(date) : new Date()
//     });

//     await workout.save();
//     res.status(200).json({ message: "Workout added successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to add workout" });
//   }
// });

// // Route: GET /workout/list
// // Get all workouts for the logged-in user
// router.get("/list", isAuthenticated, async (req, res) => {
//   try {
//     if (!req.session || !req.session.user || !req.session.user.id) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const workouts = await Workout.find({ userId: req.session.user.id }).sort({ date: -1 });

//     res.json({ workouts });
//   } catch (err) {
//     console.error("Error in /workout/list:", err);
//     res.status(500).json({ error: "Failed to fetch workouts" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const workoutController = require("../controllers/workoutController");

// add workout
router.post("/add", isAuthenticated, workoutController.addWorkout);

// get workout list
router.get("/list", isAuthenticated, workoutController.getWorkouts);

module.exports = router;

