// Models/adminModel.js
import mySqlConnection from "../Config/db.js";

const getAllUsers = async () => {
  const query = "SELECT userId, name, email, role, phoneNumber, supervisor FROM users";
  try {
    const [result] = await mySqlConnection.query(query);
    return result;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

const createUser = async (userData) => {
  const query = `
    INSERT INTO users 
    (userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  try {
    const [result] = await mySqlConnection.query(query, [
      userData.userId,
      userData.name,
      userData.email,
      userData.phoneNumber,
      userData.gender,
      userData.role,
      userData.supervisor || null
    ]);
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (userId, updates) => {
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updates[field]);
  values.push(userId);
  
  const query = `UPDATE users SET ${setClause} WHERE userId = ?`;
  
  try {
    const [result] = await mySqlConnection.query(query, values);
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  const query = "DELETE FROM users WHERE userId = ?";
  try {
    const [result] = await mySqlConnection.query(query, [userId]);
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const executeRawQuery = async (query) => {
  try {
    const [result] = await mySqlConnection.query(query);
    return result;
  } catch (error) {
    console.error("Error executing raw query:", error);
    throw error;
  }
};


export {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  executeRawQuery
};