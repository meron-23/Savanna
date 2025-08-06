import {
  createVisit,
  viewVisits,
  updateVisit,
  deleteVisit
} from "../Models/visitsAndSalesModel.js";

export const addVisit = async (req, res) => {
  const { clientId, visitDate, officeVisit, siteVisit, visitDetails } = req.body;

  try {
    const result = await createVisit(clientId, visitDate, officeVisit, siteVisit, visitDetails);
    res.status(201).json({ success: true, message: "Visit recorded", visitId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getVisits = async (req, res) => {
  try {
    const visits = await viewVisits();
    res.status(200).json({ success: true, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const putVisit = async (req, res) => {
  const { visitId } = req.params;
  const { visitDate, officeVisit, siteVisit, visitDetails } = req.body;

  try {
    const result = await updateVisit(visitId, visitDate, officeVisit, siteVisit, visitDetails);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }
    res.status(200).json({ success: true, message: "Visit updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteVisitRecord = async (req, res) => {
  const { visitId } = req.params;

  try {
    const result = await deleteVisit(visitId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }
    res.status(200).json({ success: true, message: "Visit deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
