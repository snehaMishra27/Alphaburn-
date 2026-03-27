const Workout = require("../models/Workout");

// POST /workout/add
exports.addWorkout = async (req, res) => {
  try {
    const { type, duration,calories, date } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ error: "Type and duration required" });
    }

    const workout = new Workout({
      userId: req.session.user.id,
      type,
      duration,
      calories: calories ? Number(calories) : 0,
      date: date ? new Date(date) : new Date()
    });

    await workout.save();

    res.status(200).json({ message: "Workout added successfully" });
  } catch (err) {
    console.error("addWorkout error:", err);
    res.status(500).json({ error: "Failed to add workout" });
  }
};

// GET /workout/list
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.session.user.id
    }).sort({ date: -1 });

    res.json({ workouts });
  } catch (err) {
    console.error("getWorkouts error:", err);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
};
