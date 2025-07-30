import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel
} from "../Models/userModel.js";

export const addUser = async (req, res, next) => {
  const { fullName, userName, email } = req.body;

  try {
    const result = await createUser(fullName, userName, email);
    res.status(201).json({ success: true, message: "Propspect created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const viewRes = await viewUser();
    res.status(200).json({ success: true, message: "Success", data: viewRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const putUser = async (req, res, next) => {
    const {id} = req.params;
  const { fullName, userName, email } = req.body;

  try {
    const updateRes = await updateUser(id, fullName, userName, email);
    if (updateRes.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Propspect not found" });
    }
    res.status(200).json({ success: true, message: "Propspect updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleteRes = await deleteUserModel(id);
    if (deleteRes.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Propspect not found" });
    }
    res.status(200).json({ success: true, message: "Propspect deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
