const express = require("express");
const router = express.Router();
//const authController = require("../controllers/authController");
const { register, login, logout, me,updateProfile, changePassword} = require("../controllers/authController");
const isAuthenticated = require("../middleware/auth");
// routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
// Add these two routes
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
module.exports = router;
