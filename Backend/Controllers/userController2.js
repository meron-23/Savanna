import argon2 from "argon2";
import mySqlConnection from "../Config/db.js";

export const homePage = (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
};

// Improved user lookup function
const findUserByEmail = async (email) => {
  try {
    const [rows] = await mySqlConnection.query(
      "SELECT userId, name, email, role FROM users WHERE email = ?", // Only select needed fields
      [email]
    );
    return rows;
  } catch (err) {
    console.error("Database error in findUserByEmail:", err);
    throw err; // Rethrow for higher-level handling
  }
};

// Enhanced Google callback route
export const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ 
        success: false, 
        message: "No user information found after Google authentication" 
      });
    }

    // Validate required user fields
    if (!req.user.email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Google"
      });
    }

    // Find user in database (additional verification)
    const users = await findUserByEmail(req.user.email);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this Google email"
      });
    }

    const user = users[0];
    
    // Create session or token if needed
    req.session.userId = user.userId; // Example session setup

    // Return consistent response format
    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Google callback error:", err);
    
    // Differentiate between database errors and other errors
    if (err.code === 'ER_DBACCESS_DENIED_ERROR' || err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication" 
    });
  }
};

// Password utilities (unchanged but with better error handling)
export const hashPassword = async (req, res) => {
  try {
    const hash = await argon2.hash(req.params.password, { 
      type: argon2.argon2id 
    });
    res.json({ success: true, hash });
  } catch (err) {
    console.error("Password hashing error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error while hashing password" 
    });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const valid = await argon2.verify(
      req.params.hash, 
      req.params.password
    );
    res.json({ success: true, valid });
  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error while verifying password" 
    });
  }
};