import {
  createProspect,
  updateProspect,
  viewProspect,
  deleteProspectModel,
  getProspectsWithAgents
} from "../Models/prospectModel.js";
import { normalizePhoneNumber } from "../Utils/normalizePhone.js";

export const addProspect = async (req, res, next) => {
  const { id, name, phoneNumber, interest, method, site, comment, remark, periodTime,date, dateNow, userId } = req.body;
  const phoneNumberNormalized = normalizePhoneNumber(phoneNumber);

  if (!phoneNumberNormalized) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  try {
    const result = await createProspect(id, name, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow, userId);
    res.status(201).json({ success: true, message: "Propspect created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProspect = async (req, res, next) => {
  try {
    const viewRes = await viewProspect();
    res.status(200).json({ success: true, message: "Success", data: viewRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchProspectsWithAgents = async (req, res) => {
  try {
    const fetchRes = await getProspectsWithAgents();
    res.status(200).json({ success: true, message: "Success", data: fetchRes });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const putProspect = async (req, res, next) => {
  const { id } = req.params;
  const { phoneNumber, interest, method, site, comment, remark, periodTime, date, dateNow } = req.body;
  const phoneNumberNormalized = normalizePhoneNumber(phoneNumber);

  if (!phoneNumberNormalized) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  try {
    const updateRes = await updateProspect(id, phoneNumber, phoneNumberNormalized, interest, method, site, comment, remark, periodTime, date, dateNow);
    if (updateRes.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Propspect not found" });
    }
    res.status(200).json({ success: true, message: "Propspect updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteProspect = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleteRes = await deleteProspectModel(id);
    if (deleteRes.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Propspect not found" });
    }
    res.status(200).json({ success: true, message: "Propspect deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const bulkAddProspects = async (req, res, next) => {
  const { prospects } = req.body; // Expect an array of prospect objects
  const importedCount = 0;
  const failedImports = [];

  if (!Array.isArray(prospects) || prospects.length === 0) {
    return res.status(400).json({ success: false, message: "No prospects data provided for bulk import." });
  }

  // Assuming userId is passed for each prospect or derived from auth context on backend
  // If userId is always the same for a bulk import, you might get it from req.user (if authenticated)
  // or a common field in the request body. For now, we expect it in each prospect object.

  for (const prospect of prospects) {
    const { 
      name, phoneNumber, interest, method, site, comment, remark, periodTime, userId 
    } = prospect;

    // Backend-side normalization and date generation
    const phoneNumberNormalized = normalizePhoneNumber(phoneNumber);
    const date = formatBackendDate(new Date()); // Use backend's current time for consistency
    const dateNow = formatBackendDate(new Date()); // Use backend's current time for consistency

    if (!phoneNumberNormalized) {
      failedImports.push({ prospect, reason: 'Invalid phone number format' });
      continue; // Skip to next prospect
    }

    try {
      // Note: The 'id' in createProspect is usually AUTO_INCREMENT, so you shouldn't pass it.
      // If your createProspect function requires 'id', you might need to adjust it
      // or ensure it's handled as null/undefined for auto-increment.
      // Let's assume 'id' should be omitted for new creations.
      await createProspect(
        null, // Pass null or undefined for auto-increment ID
        name, 
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
        userId // Ensure userId is present in each prospect object from frontend
      );
      importedCount++;
    } catch (error) {
      console.error("Bulk import error for prospect:", prospect.name, error);
      failedImports.push({ prospect, reason: error.message });
    }
  }

  if (importedCount > 0) {
    res.status(200).json({ 
      success: true, 
      message: `Bulk import completed. Successfully imported ${importedCount} prospects.`,
      importedCount,
      failedImports 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: `Bulk import failed. No prospects were imported.`,
      failedImports 
    });
  }
};

// Also, you need a formatBackendDate function in your backend utility if not already present
const formatBackendDate = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
