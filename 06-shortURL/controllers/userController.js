const User = require("../models/user");
const { setUser } = require("../service/auth");
const crypto = require("crypto");
const nodemailer = require("nodemailer"); // For forgot password email

// Configure email transporter (add to environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Signup
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    // 1. Check all fields exist
    if (!name || !email || !password) {
      return res.render("auth/signup", {
        error: "All fields are required",
        name: name || "",
        email: email || "",
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("auth/signup", {
        error: "Please enter a valid email address",
        name: name,
        email: email,
      });
    }

    // 3. Validate name (at least 2 characters)
    if (name.trim().length < 2) {
      return res.render("auth/signup", {
        error: "Name must be at least 2 characters",
        name: name,
        email: email,
      });
    }

    // 4. Validate password strength
    if (password.length < 6) {
      return res.render("auth/signup", {
        error: "Password must be at least 6 characters",
        name: name,
        email: email,
      });
    }

    // 5. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/signup", {
        error: "Email already registered",
        name: name,
        email: email,
      });
    }

    // 6. Create user (password auto-hashed by model)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(), // Store lowercase
      password: password,
      role: "NORMAL",
    });

    // 7. Auto login after signup
    const token = setUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("auth/signup", {
      error: "Something went wrong. Please try again.",
      name: name || "",
      email: email || "",
    });
  }
}

// Login (with password comparison)
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      error: "Both email and password are required",
      email: email || "",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/login", {
        error: "Invalid Email or Password",
        email: email,
      });
    }

    // Compare passwords using the model method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.render("auth/login", {
        error: "Invalid Email or Password",
        email: email,
      });
    }

    // Create token
    const token = setUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return res.render("auth/login", {
      error: "Something went wrong. Please try again.",
      email: email,
    });
  }
}

// Forgot Password - Step 1: Request reset
async function handleForgotPassword(req, res) {
  const { email } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.render("auth/forgot-password", {
      error: "Please enter a valid email address",
      email: email || "",
    });
  }

  try {
    const user = await User.findOne({ email });

    // For security, show same message whether user exists or not
    const message =
      "If an account exists with that email, you will receive a reset link.";

    if (!user) {
      //console.log(`Password reset requested for non-existent email: ${email}`);
      return res.render("auth/forgot-password", {
        message: message,
        email: "",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and set expiry (1 hour)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:8082/reset-password/${resetToken}`;

    // Email options
    const mailOptions = {
      from: '"URL Shortener" <noreply@urlshortener.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Password Reset Request</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.9rem;">
            This is an automated message from URL Shortener.
          </p>
        </div>
      `,
    };

    // Send email with better error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to: ${user.email}`);

      res.render("auth/forgot-password", {
        message: "Password reset link sent to your email",
        email: "",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // Clear the reset token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.render("auth/forgot-password", {
        error: "Failed to send reset email. Please try again later.",
        email: email,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.render("auth/forgot-password", {
      error: "An error occurred. Please try again.",
      email: email,
    });
  }
}

// Reset Password - Step 2: Update password
async function handleResetPassword(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.render("auth/reset-password", {
        error: "Invalid or expired reset token",
        token,
      });
    }

    // Validate passwords
    if (!password || !confirmPassword) {
      return res.render("auth/reset-password", {
        error: "Please fill in both password fields",
        token,
      });
    }

    if (password !== confirmPassword) {
      return res.render("auth/reset-password", {
        error: "Passwords do not match",
        token,
      });
    }

    if (password.length < 6) {
      return res.render("auth/reset-password", {
        error: "Password must be at least 6 characters",
        token,
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Auto-login after password reset
    const authToken = setUser(user);

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.render("auth/reset-password", {
      success: "Password reset successful! You are now logged in.",
      token: null,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.render("auth/reset-password", {
      error: "Error resetting password. Please try again.",
      token,
    });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleForgotPassword,
  handleResetPassword,
};
