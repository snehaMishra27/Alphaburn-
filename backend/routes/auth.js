const express = require("express");
const router = express.Router();
const { register, login, logout, me } = require("../controllers/authController");

// routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
// Add these two routes
router.put("/update-profile", isAuthenticated, authController.updateProfile);
router.put("/change-password", isAuthenticated, authController.changePassword);
module.exports = router;
