import {
  createProspect,
  updateProspect,
  viewProspect,
  deleteProspectModel
} from "../Models/prospectModel.js";

export const addProspect = async (req, res, next) => {
  const { fullName, userName, email } = req.body;

  try {
    const result = await createProspect(fullName, userName, email);
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

export const putProspect = async (req, res, next) => {
    const {id} = req.params;
  const { fullName, userName, email } = req.body;

  try {
    const updateRes = await updateProspect(id, fullName, userName, email);
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
