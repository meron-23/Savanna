import mySqlConnection from "../Config/db.js";


const createUser = async (userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime) => {
  const addSqlQuery = "INSERT INTO users (userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime]);
    return result;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
};

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

export {
  createUser,
  viewUser,
  updateUser,
  deleteUserModel,
  findUserByNameAndEmail,
  getUserById
};
