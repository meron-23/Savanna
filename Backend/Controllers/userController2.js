import argon2 from "argon2";
import mySqlConnection from "../Config/db.js";  // make sure the path is correct

export const homePage = (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
};

const findUserByEmail = async (email) => {
  const [rows] = await mySqlConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

// Google callback route
export const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ 
        success: false, 
        message: "No Google user info found" 
      });
    }

    // Assuming your passport strategy attaches user info to req.user
    const { userId, name, email, role } = req.user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId,
        name,
        email,
        role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};
export const hashPassword = async (req, res) => {
  const hash = await argon2.hash(req.params.password, { type: argon2.argon2id });
  res.send({ hash });
};

export const verifyPassword = async (req, res) => {
  const valid = await argon2.verify(req.params.hash, req.params.password);
  res.send({ valid });
};
