const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const metricsController = require("../controllers/metricsController");

// ✅ GET all metrics for logged in user
router.get("/", isAuthenticated, metricsController.getMetrics);

// add metrics
router.post("/add", isAuthenticated, metricsController.addMetrics);

module.exports = router;
