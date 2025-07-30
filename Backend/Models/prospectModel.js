import mySqlConnection from "../Config/db.js";


const createProspect = async (fullName, userName, email) => {
  const addSqlQuery = "INSERT INTO prospects (full_name, user_name, email) VALUES (?, ?, ?)";
  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [fullName, userName, email]);
    return result;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
};

const viewProspect = async () => {
  const viewSqlQuery = "SELECT * FROM prospects";
  try {
    const [result] = await mySqlConnection.query(viewSqlQuery);
    return result;
  } catch (error) {
    console.error("View error:", error);
    throw error;
  }
};

const updateProspect = async (id, full_name, user_name, email) => {
  const updateSqlQuery = "UPDATE prospects SET full_name=?, user_name=?, email=? WHERE id=?";
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

const deleteProspectModel = async (id) => {
  const deleteSqlQuery = "DELETE FROM prospects WHERE id=?";
  try {
    const [result] = await mySqlConnection.query(deleteSqlQuery, [id]);
    return result;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

export {
  createProspect,
  viewProspect,
  updateProspect,
  deleteProspectModel
};
