const Metrics = require("../models/Metrics");

// GET /metrics
exports.getMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.find({
      userId: req.session.user.id
    }).sort({ date: -1 });

    res.json(metrics);
  } catch (err) {
    console.error("getMetrics error:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

// POST /metrics/add
exports.addMetrics = async (req, res) => {
  try {
    const { sleepDuration, weight, date } = req.body;

    if (!sleepDuration && !weight) {
      return res.status(400).json({
        error: "Provide sleepHours or weight"
      });
    }

    const metrics = new Metrics({
      userId: req.session.user.id,
      sleepDuration,
      weight,
      date: date ? new Date(date) : new Date()
    });

    await metrics.save();

    res.json({ message: "Metrics added successfully" });
  } catch (err) {
    console.error("addMetrics error:", err);
    res.status(500).json({ error: "Failed to add metrics" });
  }
};
