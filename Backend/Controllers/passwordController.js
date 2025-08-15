import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import db from "../Config/db.js";

// Send reset email (existing functionality)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}?email=${email}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset</p>
             <p>Click this link to reset your password: 
             <a href="${resetLink}">${resetLink}</a></p>
             <p>This link will expire in 1 hour.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res.status(400).json({ message: "Token, email, and password are required" });
  }

  try {
    // Verify token and email
    const [user] = await db.query(
      "SELECT * FROM users WHERE resetToken = ? AND email = ? AND resetTokenExpiry > NOW()",
      [token, email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token
    await db.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE userId = ?",
      [hashedPassword, user[0].userId]
    );

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
