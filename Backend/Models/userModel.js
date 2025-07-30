import mySqlConnection from "../Config/db.js";


const createUser = async (fullName, userName, email) => {
  const addSqlQuery = "INSERT INTO users (full_name, user_name, email) VALUES (?, ?, ?)";
  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [fullName, userName, email]);
    return result;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
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

const updateUser = async (id, full_name, user_name, email) => {
  const updateSqlQuery = "UPDATE users SET full_name=?, user_name=?, email=? WHERE id=?";
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, [
      full_name,
      user_name,
      email,
      id
    ]);
    return result;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

const deleteUserModel = async (id) => {
  const deleteSqlQuery = "DELETE FROM users WHERE id=?";
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
  deleteUserModel
};
