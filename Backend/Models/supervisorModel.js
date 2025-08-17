// Models/supervisorModel.js
import mySqlConnection from "../Config/db.js";

const getAgentsBySupervisor = async (supervisorId) => {
  console.log(supervisorId)
  const query = "SELECT * FROM users WHERE supervisor = ? AND role = 'Agent'";
  try {
    const [result] = await mySqlConnection.query(query, [supervisorId]);
    return result;
  } catch (error) {
    console.error("Error fetching agents by supervisor:", error);
    throw error;
  }
};

const getSupervisorDashboardStats = async (supervisorId) => {
  // Queries adjusted: SaleMade and SaleAmount columns are removed as they don't exist in VisitsAndSales
  const query = `
    SELECT
      COUNT(DISTINCT p.id) AS totalProspects,
      (SELECT COUNT(*) FROM ClientFeedback cf
        JOIN prospects p ON cf.ClientID = p.id
        JOIN users u ON p.userId = u.userId
        WHERE u.supervisor = ? OR u.userId = ?) AS totalFeedbacks,
      (SELECT COUNT(*) FROM VisitsAndSales vs
        JOIN prospects p ON vs.ClientID = p.id
        JOIN users u ON p.userId = u.userId
        WHERE (u.supervisor = ? OR u.userId = ?) AND vs.OfficeVisit = TRUE) AS officeVisits,
      (SELECT COUNT(*) FROM VisitsAndSales vs
        JOIN prospects p ON vs.ClientID = p.id
        JOIN users u ON p.userId = u.userId
        WHERE (u.supervisor = ? OR u.userId = ?) AND vs.SiteVisit = TRUE) AS siteVisits,
      0 AS totalSales,  -- Set to 0 because SaleMade column does not exist
      0.00 AS salesAmount -- Set to 0.00 because SaleAmount column does not exist
    FROM users u
    LEFT JOIN prospects p ON p.userId = u.userId
    WHERE u.supervisor = ? OR u.userId = ?
  `;

  try {
    const [result] = await mySqlConnection.query(query,
      [supervisorId, supervisorId, supervisorId, supervisorId,
        supervisorId, supervisorId, supervisorId, supervisorId,
        supervisorId, supervisorId]); // Reduced parameters as SaleMade/Amount conditions removed
    return result[0];
  } catch (error) {
    console.error("Error fetching supervisor dashboard stats:", error);
    throw error;
  }
};

const getAgentPerformance = async (supervisorId) => {
  // Queries adjusted: SaleMade and SaleAmount columns are removed as they don't exist in VisitsAndSales
  const query = `
    SELECT
      u.userId,
      u.name,
      (SELECT COUNT(*) FROM VisitsAndSales vs
        JOIN prospects p ON vs.ClientID = p.id
        WHERE p.userId = u.userId AND vs.OfficeVisit = TRUE) AS officeVisits,
      (SELECT COUNT(*) FROM VisitsAndSales vs
        JOIN prospects p ON vs.ClientID = p.id
        WHERE p.userId = u.userId AND vs.SiteVisit = TRUE) AS siteVisits,
      0 AS totalSales,  -- Set to 0 because SaleMade column does not exist
      0.00 AS salesAmount -- Set to 0.00 because SaleAmount column does not exist
    FROM users u
    WHERE u.supervisor = ? AND u.role = 'Sales Agent'
  `;

  try {
    const [result] = await mySqlConnection.query(query, [supervisorId]);
    return result;
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    throw error;
  }
};

const getUnassignedAgents = async () => {
    const query = "SELECT userId, name, email, phoneNumber FROM users WHERE role = 'Agent' AND supervisor IS NULL";
    try {
        const [result] = await mySqlConnection.query(query);
        return result;
    } catch (error) {
        console.error("Error fetching unassigned agents:", error);
        throw error;
    }
};

const getSupervisorName = async (supervisorId) => {
  console.log(supervisorId)
    const query = "SELECT name FROM users WHERE userId = ?";
    try {
        const [result] = await mySqlConnection.query(query, [supervisorId]);
        return result.length > 0 ? result[0].name : null;
    } catch (error) {
        console.error("Error fetching supervisor name:", error);
        throw error;
    }
};

const assignSupervisorToAgent = async (agentId, supervisorId) => {
    // Get the supervisor's name before assigning
    const supervisorName = await getSupervisorName(supervisorId);
    if (!supervisorName) {
        throw new Error("Supervisor not found.");
    }

    const query = "UPDATE users SET supervisor = ? WHERE userId = ? AND supervisor IS NULL";
    try {
        const [result] = await mySqlConnection.query(query, [supervisorName, agentId]); // Use supervisorName here
        if (result.affectedRows === 0) {
            throw new Error("Agent not found or already has a supervisor.");
        }
        return result;
    } catch (error) {
        console.error("Error assigning supervisor to agent:", error);
        throw error;
    }
};


export {
    getAgentsBySupervisor,
    getSupervisorDashboardStats,
    getAgentPerformance,
    getUnassignedAgents,
    getSupervisorName,
    assignSupervisorToAgent
};