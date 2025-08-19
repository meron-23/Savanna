import mySqlConnection from "../Config/db.js";

const createLead = async (name, phone, interest, status, date_added, user_id) => {
  const addSqlQuery = "INSERT INTO leads (name, phone, interest, status, date_added, user_id) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await mySqlConnection.query(addSqlQuery, [
      name, 
      phone, 
      interest, 
      status || 'new',
      date_added,
      user_id
    ]);
    return result;
  } catch (error) {
    console.error("Create lead error:", error);
    throw error;
  }
};

const getAllLeads = async () => {
  const viewSqlQuery = `
    SELECT 
      leads.*, 
      users.name as user_name,
      users.email as user_email
    FROM leads
    LEFT JOIN users ON leads.user_id = users.userId
  `;
  
  try {
    const [result] = await mySqlConnection.query(viewSqlQuery);
    return result;
  } catch (error) {
    console.error("Get all leads error:", error);
    throw error;
  }
};

const getLeadById = async (id) => {
  const query = "SELECT * FROM leads WHERE id = ?";
  try {
    const [result] = await mySqlConnection.query(query, [id]);
    return result[0]; // Return single lead
  } catch (error) {
    console.error("Get lead by ID error:", error);
    throw error;
  }
};

const getLeadsByProspectId = async (prospectId) => {
  const query = "SELECT * FROM leads WHERE prospect_id = ?";
  try {
    const [result] = await mySqlConnection.query(query, [prospectId]);
    return result;
  } catch (error) {
    console.error("Get leads by prospect ID error:", error);
    throw error;
  }
};

const updateLead = async (id, updates) => {
  // Dynamically build the update query based on provided fields
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updates[field]);
  values.push(id);
  
  const updateSqlQuery = `UPDATE leads SET ${setClause} WHERE id = ?`;
  
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, values);
    return result;
  } catch (error) {
    console.error("Update lead error:", error);
    throw error;
  }
};

const updateLeadStatus = async (id, status, assigned_to) => {
  const updateSqlQuery = "UPDATE leads SET status = ?, user_id = ? WHERE id = ?";
  try {
    const [result] = await mySqlConnection.query(updateSqlQuery, [status, assigned_to, id]);
    return result;
  } catch (error) {
    console.error("Update lead status error:", error);
    throw error;
  }
};

const deleteLead = async (id) => {
  const deleteSqlQuery = "DELETE FROM leads WHERE id = ?";
  try {
    const [result] = await mySqlConnection.query(deleteSqlQuery, [id]);
    return result;
  } catch (error) {
    console.error("Delete lead error:", error);
    throw error;
  }
};

const getLeadsWithProspectInfo = async () => {
  const query = `
    SELECT 
      l.id AS lead_id,
      l.name AS lead_name,
      l.phone,
      l.interest,
      l.status,
      l.date_added,
      p.id AS prospect_id,
      p.name AS prospect_name,
      p.phoneNumber AS prospect_phone,
      p.interest AS prospect_interest,
      p.method,
      p.site,
      p.comment,
      p.remark,
      p.periodTime,
      p.date,
      p.dateNow
    FROM leads l
    JOIN prospects p ON l.prospect_id = p.id
  `;
  try {
    const [rows] = await mySqlConnection.query(query);
    return rows;
  } catch (error) {
    console.error("Get leads with prospect info error:", error);
    throw error;
  }
};

const getFullLeadDetails = async () => {
  const query = `
    SELECT 
      l.id AS lead_id,
      l.name AS lead_name,
      l.phone,
      l.interest AS lead_interest,
      l.status,
      l.date_added,
      
      u.userId AS agent_id,
      u.name AS agent_name,
      u.email AS agent_email,
      u.phoneNumber AS agent_phone,
      u.role AS agent_role,
      u.supervisor
    FROM leads l
    JOIN users u ON l.user_id = u.userId
    ORDER BY l.date_added DESC
  `;
  
  try {
    const [rows] = await mySqlConnection.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching full lead details:", error);
    throw error;
  }
};

export {
  createLead,
  getAllLeads,
  getLeadById,
  getLeadsByProspectId,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadsWithProspectInfo,
  getFullLeadDetails
};