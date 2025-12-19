const express = require("express");
const router = express.Router();
const {
  handleUserSignup,
  handleUserLogin,
  handleForgotPassword,
  handleResetPassword,
} = require("../controllers/userController");

// GET routes
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// POST routes
router.post("/", handleUserSignup); // Signup
router.post("/login", handleUserLogin); // Login
router.post("/forgot-password", handleForgotPassword); // Forgot password
router.post("reset-password", handleResetPassword);

module.exports = router;
