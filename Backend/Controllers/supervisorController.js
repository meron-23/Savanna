// Controllers/supervisorController.js
import {
    getAgentsBySupervisor,
    getSupervisorDashboardStats,
    getAgentPerformance,
    getUnassignedAgents, // New import
    assignSupervisorToAgent // New import
} from "../Models/supervisorModel.js";

import {
  createUser, // Import createUser from userModel for agent registration
  generateUserId // Import generateUserId from userModel
} from "../Models/userModel.js";


export const getSupervisorAgents = async (req, res, next) => {
  const { supervisorId } = req.params;
  const name = 'kendall';

  try {
    const agents = await getAgentsBySupervisor(name);
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res, next) => {
  const { supervisorId } = req.params;

  try {
    const stats = await getSupervisorDashboardStats(supervisorId);
    const performance = await getAgentPerformance(supervisorId);

    // --- Placeholder data for recentFeedbacks and salesTrend ---
    // In a real application, you would fetch this data from your database
    // based on relevant models (e.g., ClientFeedbackModel, VisitsAndSalesModel)
    const recentFeedbacks = [
      { id: 1, clientName: 'Client A', feedback: 'Very satisfied with the service.' },
      { id: 2, clientName: 'Client B', feedback: 'Needs more follow-up.' },
    ];

    const salesTrend = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 2000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
    ];
    // --- End Placeholder ---

    // Calculate visit distribution
    const totalVisits = stats.officeVisits + stats.siteVisits;
    const visitDistribution = [
      { name: 'Site Visits', value: totalVisits > 0 ? Math.round((stats.siteVisits / totalVisits) * 100) : 0 },
      { name: 'Office Visits', value: totalVisits > 0 ? Math.round((stats.officeVisits / totalVisits) * 100) : 0 }
    ];

    res.status(200).json({
      success: true,
      data: {
        stats,
        agentsPerformance: performance,
        visitDistribution,
        recentFeedbacks,
        salesTrend
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const registerAgent = async (req, res, next) => {
  const { supervisorId } = req.params;
  const { name, email, phoneNumber, gender } = req.body;

  const userId = generateUserId(); // Use the imported helper function
  const creationTime = new Date();
  const lastSignInTime = new Date();

  try {
    const result = await createUser( // Use createUser from userModel
      userId,
      name,
      email,
      phoneNumber,
      gender,
      'Sales Agent', // Role for registered agents
      supervisorId,
      creationTime,
      lastSignInTime
    );

    res.status(201).json({
      success: true,
      message: "Agent registered successfully",
      agentId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// New controller to get a list of unassigned agents
export const getUnassignedAgentsList = async (req, res, next) => {
    try {
        const agents = await getUnassignedAgents();
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// New controller to assign a supervisor to an agent
export const assignAgent = async (req, res, next) => {
    const { supervisorId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
        return res.status(400).json({ success: false, message: "Agent ID is required." });
    }

    try {
        await assignSupervisorToAgent(agentId, supervisorId);
        res.status(200).json({ success: true, message: "Agent assigned successfully!" });
    } catch (error) {
        console.error(error);
        // Handle specific error from model
        if (error.message.includes("already has a supervisor")) {
            res.status(409).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};