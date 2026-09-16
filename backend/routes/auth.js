const express = require("express");
const router = express.Router();
//const authController = require("../controllers/authController");
const { register, login, logout, me,updateProfile, changePassword} = require("../controllers/authController");  //doesnt lnow how file works this just call them
const isAuthenticated = require("../middleware/auth");  //checks for authentication
// routes
router.post("/register", register); //frontend sends auth/register but app.js attaches /auth before every route
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
// Add these two routes
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
module.exports = router;
