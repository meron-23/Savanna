import mySqlConnection from "../Config/db.js";


const createProspect = async (id, name, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow, userId) => {
  const addSqlQuery = "INSERT INTO prospects (id, name, phoneNumber, phoneNumber_normalized, interest, method, site, comment, remark, periodTime, date, dateNow, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [id, name, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow, userId]);
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

const updateProspect = async (id, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow) => {
  const updateSqlQuery = "UPDATE prospects SET phoneNumber=?, phoneNumber_normalized=?, interest=?, method=?, site=?, comment=?, remark=?, periodTime=?, date=?, dateNow=? WHERE id=?";
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, [
      phoneNumber,
      phoneNumberNormalized,
      interest,
      method,
      site,
      comment,
      remark,
      periodTime,
      date,
      dateNow,
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
