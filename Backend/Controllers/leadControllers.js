import {
  createLead,
  getAllLeads,
  getLeadById,
  getLeadsByProspectId,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadsWithProspectInfo,
  getFullLeadDetails
} from "../Models/leadModel.js";

// Create a new lead
export const createLeadController = async (req, res) => {
  try {
    const { name, phone, interest, status, date_added, user_id } = req.body;
    const result = await createLead(name, phone, interest, status, date_added, user_id );
    res.status(201).json({ 
      success: true, 
      message: "Lead created successfully", 
      data: result 
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create lead", 
      error: error.message 
    });
  }
};

// Get all leads
export const getAllLeadsController = async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.status(200).json({ 
      success: true, 
      data: leads 
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leads", 
      error: error.message 
    });
  }
};

// Get lead by ID
export const getLeadByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await getLeadById(id);
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: lead 
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch lead", 
      error: error.message 
    });
  }
};

// Get leads by prospect ID
export const getLeadsByProspectIdController = async (req, res) => {
  try {
    const { prospectId } = req.params;
    const leads = await getLeadsByProspectId(prospectId);
    res.status(200).json({ 
      success: true, 
      data: leads 
    });
  } catch (error) {
    console.error("Error fetching leads by prospect:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leads for this prospect", 
      error: error.message 
    });
  }
};

// Update lead details
export const updateLeadController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await updateLead(id, updates);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found or no changes made" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Lead updated successfully" 
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update lead", 
      error: error.message 
    });
  }
};

// Update lead status only
export const updateLeadStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;
    const result = await updateLeadStatus(id, status, assigned_to);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Lead status updated successfully" 
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update lead status", 
      error: error.message 
    });
  }
};

// Delete a lead
export const deleteLeadController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteLead(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Lead not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Lead deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete lead", 
      error: error.message 
    });
  }
};

// Get leads with prospect info (joined data)
export const getLeadsWithProspectInfoController = async (req, res) => {
  try {
    const leads = await getLeadsWithProspectInfo();
    res.status(200).json({ 
      success: true, 
      data: leads 
    });
  } catch (error) {
    console.error("Error fetching leads with prospect info:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leads with prospect details", 
      error: error.message 
    });
  }
};

export const getFullLeadDetailsController = async (req, res) => {
  try {
    const leads = await getFullLeadDetails();
    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    console.error("Error in getFullLeadDetails:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead details",
      error: error.message
    });
  }
};