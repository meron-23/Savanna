import mySqlConnection from "../Config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Generate unique user ID
const generateUserId = () => {
  return 'user_' + crypto.randomBytes(16).toString('hex');
};

// Create new user
const createUser = async (
  userId,
  name,
  email,
  password,
  phoneNumber,
  gender,
  role,
  supervisor,
  creationTime,
  lastSignInTime
) => {
  const query = `
    INSERT INTO users (
      userId, name, email, password, phoneNumber, 
      gender, role, supervisor, creationTime, lastSignInTime
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await mySqlConnection.query(query, [
      userId, name, email, password, phoneNumber,
      gender, role, supervisor, creationTime, lastSignInTime
    ]);
    return result;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const [rows] = await mySqlConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Find user by email error:", error);
    throw error;
  }
};

// Find user by token and check expiry
const findUserByToken = async (token) => {
  try {
    const now = new Date();
    const [rows] = await mySqlConnection.query(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?",
      [token, now]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Find user by token error:", error);
    throw error;
  }
};

// Set reset token and expiry
const updateUserResetToken = async (email, token, expiry) => {
  try {
    const [result] = await mySqlConnection.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
      [token, expiry, email]
    );
    return result;
  } catch (error) {
    console.error("Update reset token error:", error);
    throw error;
  }
};

// Update password and clear reset token fields
const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const [result] = await mySqlConnection.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE userId = ?",
      [hashedPassword, userId]
    );
    return result;
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};

// Get all users
const viewUser = async () => {
  try {
    const [result] = await mySqlConnection.query("SELECT * FROM users");
    return result;
  } catch (error) {
    console.error("View users error:", error);
    throw error;
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const [result] = await mySqlConnection.query(
      "SELECT * FROM users WHERE userId = ?",
      [id]
    );
    return result[0] || null;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

// Update user fields dynamically
const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(id);

  try {
    const [result] = await mySqlConnection.query(
      `UPDATE users SET ${fields.join(", ")} WHERE userId = ?`,
      values
    );
    return result;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

// Delete user
const deleteUserModel = async (id) => {
  try {
    const [result] = await mySqlConnection.query(
      "DELETE FROM users WHERE userId = ?",
      [id]
    );
    return result;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// Export all functions
export {
  createUser,
  viewUser,
  updateUser,
  deleteUserModel,
  findUserByEmail,
  getUserById,
  generateUserId,
  findUserByToken,
  updateUserResetToken,
  updateUserPassword
};
