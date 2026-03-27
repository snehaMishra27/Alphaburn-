// example Workout.js
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  duration: Number,
  calories:Number,
  date: Date
});

module.exports = mongoose.model("Workout", workoutSchema);
