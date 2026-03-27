const mongoose = require("mongoose");

const metricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sleepDuration: Number,
  weight: Number,
  date: Date
});

module.exports = mongoose.model("Metrics", metricsSchema);
