import mySqlConnection from "../Config/db.js";

const createVisit = async (clientId, visitDate, officeVisit, siteVisit, visitDetails) => {
  const sql = `INSERT INTO VisitsAndSales (ClientID, VisitDate, OfficeVisit, SiteVisit, VisitDetails)
               VALUES (?, ?, ?, ?, ?)`;
  try {
    const [result] = await mySqlConnection.query(sql, [clientId, visitDate, officeVisit, siteVisit, visitDetails]);
    return result;
  } catch (error) {
    console.error("Create Visit Error:", error);
    throw error;
  }
};

const viewVisits = async () => {
  const sql = `SELECT * FROM VisitsAndSales`;
  try {
    const [result] = await mySqlConnection.query(sql);
    return result;
  } catch (error) {
    console.error("View Visits Error:", error);
    throw error;
  }
};

const getVisitsWithProspectsAndAgents = async () => {
  const query = `
    SELECT 
      v.VisitID,
      v.VisitDate,
      v.OfficeVisit,
      v.SiteVisit,
      v.VisitDetails,

      p.id AS prospect_id,
      p.name AS prospect_name,
      p.phoneNumber,
      p.interest,
      p.method,
      p.site,

      u.userId AS agent_id,
      u.name AS agent_name,
      u.email AS agent_email,
      u.role AS agent_role
    FROM VisitsAndSales v
    JOIN prospects p ON v.ClientID = p.id
    JOIN users u ON p.userId = u.userId
  `;
  const [rows] = await mySqlConnection.query(query);
  return rows;
};

const updateVisit = async (visitId, visitDate, officeVisit, siteVisit, visitDetails) => {
  const sql = `UPDATE VisitsAndSales SET VisitDate=?, OfficeVisit=?, SiteVisit=?, VisitDetails=? WHERE VisitID=?`;
  try {
    const [result] = await mySqlConnection.query(sql, [visitDate, officeVisit, siteVisit, visitDetails, visitId]);
    return result;
  } catch (error) {
    console.error("Update Visit Error:", error);
    throw error;
  }
};

const deleteVisit = async (visitId) => {
  const sql = `DELETE FROM VisitsAndSales WHERE VisitID=?`;
  try {
    const [result] = await mySqlConnection.query(sql, [visitId]);
    return result;
  } catch (error) {
    console.error("Delete Visit Error:", error);
    throw error;
  }
};

export {
  createVisit,
  viewVisits,
  getVisitsWithProspectsAndAgents,
  updateVisit,
  deleteVisit
};