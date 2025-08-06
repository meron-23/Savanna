import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel,
  findUserByNameAndEmail,
  getUserById,
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

export const loginUser = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const [user] = await findUserByNameAndEmail(name, email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid name or email" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
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

export const fetchUserById = async (req, res, next) => {
  const {id} = req.params;

  try {
    const viewRes = await getUserById(id);
    res.status(200).json({ success: true, message: "Success", data: viewRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const putUser = async (req, res, next) => {
  const {id} = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    const updateRes = await updateUser(id, name, email, phoneNumber);
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
