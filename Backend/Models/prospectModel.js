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

const getProspectsWithAgents = async () => {
  const query = `
    SELECT 
      p.id AS prospect_id,
      p.name AS prospect_name,
      p.phoneNumber,
      p.phoneNumber_normalized,
      p.interest,
      p.method,
      p.site,
      p.comment,
      p.remark,
      p.periodTime,
      p.date,
      p.dateNow,
      u.userId AS agent_id,
      u.name AS agent_name,
      u.email AS agent_email,
      u.phoneNumber AS agent_phone,
      u.gender AS agent_gender,
      u.role AS agent_role,
      u.supervisor,
      u.creationTime,
      u.lastSignInTime
    FROM prospects p
    JOIN users u ON p.userId = u.userId
  `;
  const [rows] = await mySqlConnection.query(query);
  return rows;
};

const updateProspect = async (id, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow) => {
  const updateSqlQuery = `
    UPDATE prospects 
    SET 
      phoneNumber = ?,
      phoneNumber_normalized = ?,
      interest = ?,
      method = ?,
      site = ?,
      comment = ?,
      remark = ?,
      periodTime = ?,
      date = ?,
      dateNow = ?
    WHERE id = ?
  `;
  
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, [
      phoneNumber,
      phoneNumberNormalized,
      interest,
      method,
      site,
      comment,
      remark,
      periodTime || null,
      date || null,
      dateNow || null,
      id
    ]);
    return result;
  } catch (error) {
    console.error("SQL Error:", error);
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
  getProspectsWithAgents,
  updateProspect,
  deleteProspectModel
};
