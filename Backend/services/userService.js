import db from '../Config/db.js';
import bcrypt from 'bcryptjs';

// Find user by email
export const findUserByEmail = async (email) => {
  const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return user[0]; // return single user object or undefined
};

// Update reset token and expiry
export const updateUserResetToken = async (email, token, expiry) => {
  await db.query(
    'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?',
    [token, expiry, email]
  );
};

// Update password and clear reset token fields
export const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query(
    'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE userId = ?',
    [hashedPassword, userId]
  );
};
