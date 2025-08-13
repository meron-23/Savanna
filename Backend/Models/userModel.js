import mySqlConnection from "../Config/db.js";

const generateUserId = () => {
  // Generates a random string that can serve as a unique ID
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};


// Updated to accept 'password' hash
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
  lastSignInTime,
  login_method = 'email', // Default to email
  is_active = 1,          // Default to active
  google_id = null        // Default to null
) => {
  const addSqlQuery = `
    INSERT INTO users (
      userId, 
      name, 
      email,
      phoneNumber, 
      gender, 
      role, 
      supervisor, 
      creationTime, 
      lastSignInTime,
      password,
      is_active,
      login_method,
      google_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [
      userId,
      name,
      email,
      phoneNumber,
      gender,
      role,
      supervisor,
      creationTime,
      lastSignInTime,
      password,
      is_active,
      login_method,
      google_id
    ]);
    return result;
  } catch (error) {
    console.error("Create user error:", error);
    
    // Handle duplicate email error specifically
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists in system');
    }
    
    throw error;
  }
};

// New function to find a user by their email for login
const findUserByEmail = async (email) => {
  const [rows] = await mySqlConnection.query("SELECT * FROM users WHERE email = ?", [email]);
  // Return the first user found, or null if none
  return rows[0]; 
};

// You can keep or remove this function, but it is not needed for password-based login
const findUserByNameAndEmail = async (name, email) => {
  const [rows] = await mySqlConnection.query("SELECT * FROM users WHERE name = ? AND email = ?", [name, email]);
  return rows;
};


const viewUser = async () => {
  const viewSqlQuery = "SELECT * FROM users";
  try {
    const [result] = await mySqlConnection.query(viewSqlQuery);
    return result;
  } catch (error) {
    console.error("View error:", error);
    throw error;
  }
};

const getUserById = async (id) => {
  const viewSqlQuery = "SELECT * FROM users where userId = ?";
  try {
    const [result] = await mySqlConnection.query(viewSqlQuery, [id]);
    return result;
  } catch (error) {
    console.error("View error:", error);
    throw error;
  }
};

const updateUser = async (id, name, email, phoneNumber) => {
  const updateSqlQuery = "UPDATE users SET name = ?, email=?, phoneNumber=? WHERE userId=?";
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, [
      name,
      email,
      phoneNumber,
      id
    ]);
    return result;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

const deleteUserModel = async (id) => {
  const deleteSqlQuery = "DELETE FROM users WHERE userId=?";
  try {
    const [result] = await mySqlConnection.query(deleteSqlQuery, [id]);
    return result;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};


// Add the new function to your exports
export {
  createUser,
  viewUser,
  updateUser,
  deleteUserModel,
  findUserByNameAndEmail,
  getUserById,
  generateUserId,
  findUserByEmail
};
