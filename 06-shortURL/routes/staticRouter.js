const express = require("express");
const URL = require("../models/url");
const User = require("../models/user"); // Import at top
const { restrictTo } = require("../middleware/middleware");
const {
  handleResetPassword,
  handleForgotPassword,
} = require("../controllers/userController");

const router = express.Router();

// Home page - shows different content for logged in vs guest
router.get("/", async (req, res) => {
  // If user is logged in, show their URLs
  if (req.user) {
    const allUrls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
      user: req.user,
      urls: allUrls,
    });
  }

  // If guest, show landing page
  return res.render("home", {
    user: null,
    urls: null,
  });
});

// URL Generator page - Use home.ejs with a flag
router.get("/url", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    user: req.user,
    urls: allUrls,
    showGenerator: true, // Add flag to show generator prominently
  });
});

// Admin Dashboard with real stats
router.get("/admin", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    // Fetch real statistics
    const totalUsers = await User.countDocuments();
    const totalURLs = await URL.countDocuments();

    // Calculate total clicks across all URLs
    const allURLs = await URL.find({});
    let totalClicks = 0;
    allURLs.forEach((url) => {
      totalClicks += url.visitedHistory.length;
    });

    return res.render("admin/admin", {
      user: req.user,
      stats: {
        totalUsers,
        totalURLs,
        totalClicks,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.redirect("/");
  }
});

// Add this route AFTER the admin routes

router.post(
  "/admin/users/:userId/make-admin",
  restrictTo(["ADMIN"]),
  async (req, res) => {
    try {
      const User = require("../models/user");

      // Check if user exists
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user role to ADMIN
      user.role = "ADMIN";
      await user.save();

      res.json({
        success: true,
        message: "User promoted to Admin successfully",
      });
    } catch (error) {
      console.error("Make admin error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Manage Users Page
router.get("/admin/users", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude passwords

    // ✅ CORRECT PATH: admin/users.ejs
    return res.render("admin/users", {
      user: req.user,
      users: users,
    });
  } catch (error) {
    console.error("Manage users error:", error);
    return res.redirect("/admin");
  }
});

// View All URLs Page
router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const urls = await URL.find({})
      .populate("createdBy", "name email") // Get user info
      .sort({ createdAt: -1 }); // Newest first

    // ✅ CORRECT PATH: admin/urls.ejs
    return res.render("admin/urls", {
      user: req.user,
      urls: urls,
    });
  } catch (error) {
    console.error("View URLs error:", error);
    return res.redirect("/admin");
  }
});

// Login page
router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/login", {
    error: null,
    email: "",
  });
});

// Signup page
router.get("/signup", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/signup", {
    error: null,
    name: "", // Add this
    email: "", // Add this
  });
});

// Forgot Password Page
router.get("/forgot-password", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/forgot-password", {
    error: null,
    message: null,
    email: "",
  });
});

// Reset Password Page
router.get("/reset-password/:token", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/reset-password", {
    error: null,
    success: null,
    token: req.params.token,
  });
});

// Handle Reset Password POST
router.post("/reset-password/:token", handleResetPassword);
//router.post("/forgot-password", handleForgotPassword);

// Profile Page
// Profile Page - FIXED VERSION
router.get("/profile", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  try {
    const User = require("../models/user");
    const URL = require("../models/url");

    // Fetch COMPLETE user data from database (not just JWT token)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect("/login");
    }

    // Get user's stats
    const totalURLs = await URL.countDocuments({ createdBy: user._id });

    // Calculate total clicks for user's URLs
    const userURLs = await URL.find({ createdBy: user._id });
    let totalClicks = 0;
    userURLs.forEach((url) => {
      totalClicks += (url.visitedHistory && url.visitedHistory.length) || 0;
    });

    // Format dates
    const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const accountAge = Math.floor(
      (new Date() - joinDate) / (1000 * 60 * 60 * 24)
    );

    return res.render("profile", {
      user: user, // Use FULL user object from DB, not req.user
      stats: {
        totalURLs: totalURLs,
        totalClicks: totalClicks,
      },
      formatted: {
        joinDate: joinDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        accountAge: accountAge >= 0 ? accountAge : 0,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.redirect("/");
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
