import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel
} from "../Models/userModel.js";

export const addUser = async (req, res, next) => {
  const { userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime } = req.body;

  try {
    const result = await createUser(userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime);
    res.status(201).json({ success: true, message: "User created", id: result.insertId });
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
  const { email, phoneNumber, supervisor, lastSignInTime } = req.body;

  try {
    const updateRes = await updateUser(id, email, phoneNumber, supervisor, lastSignInTime);
    if (updateRes.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Users not found" });
    }
    res.status(200).json({ success: true, message: "Users updated successfully" });
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
      return res.status(404).json({ success: false, message: "Users not found" });
    }
    res.status(200).json({ success: true, message: "Users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
