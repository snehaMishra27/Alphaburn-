const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const workoutController = require("../controllers/workoutController");

// add workout
router.post("/add", isAuthenticated, workoutController.addWorkout);

// get workout list
router.get("/list", isAuthenticated, workoutController.getWorkouts);

module.exports = router;

