// Controllers/adminController.js
import {
  getAllUsers,
  updateUser,
  deleteUser,
  executeRawQuery
} from "../Models/adminModel.js";
import { generateUserId,createUser } from "../Models/userModel.js";
import router from "../routes/adminRoute.js";

import argon2 from 'argon2';

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const createUserController = async (req, res) => {
  try {
        const { name, email, phoneNumber, gender, role, supervisor,password } = req.body;
    
        // Validate required fields
        if (!name || !email || !role) {
          return res.status(400).json({
            success: false,
            message: 'Name, email, and role are required fields'
          });
        }
    
        // // Generate a random password if not provided
        // const randomPassword = '123456';
        const hashedPassword = await argon2.hash(password);
    
        const newUser = {
          userId: crypto.randomUUID().substring(0, 28),
          name,
          email,
          password: hashedPassword,
          phoneNumber: phoneNumber || '',
          gender: gender || 'Other',
          role,
          supervisor: role === 'Supervisor' ? null : supervisor || null,
          creationTime: new Date(),
          lastSignInTime: new Date(),
          login_method: 'email',
          is_active: 1,
          google_id: null 
        };
    
        // Save to database (implementation depends on your DB)
        const createdUser = await createUser(
            newUser.userId,
            newUser.name,
            newUser.email,
            newUser.password,
            newUser.phoneNumber,
            newUser.gender,
            newUser.role,
            newUser.supervisor,
            newUser.creationTime,
            newUser.lastSignInTime,
            newUser.login_method,    // Optional (default: 'email')
            newUser.is_active,      // Optional (default: 1)
            newUser.google_id       // Optional (default: null)
          );
    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await updateUser(userId, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await deleteUser(userId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export const executeQueryController = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Basic validation to prevent destructive operations
    if (query.trim().toUpperCase().startsWith('DROP') || 
        query.trim().toUpperCase().startsWith('TRUNCATE') ||
        query.trim().toUpperCase().startsWith('DELETE FROM')) {
      return res.status(400).json({ 
        success: false, 
        message: "Destructive operations are not allowed" 
      });
    }
    
    const result = await executeRawQuery(query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, message: "Query execution failed" });
  }
};
export const generatePasswordController = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password);
    res.status(200).json({ 
      success: true, 
      hashedPassword 
    });
  } catch (error) {
    console.error("Error generating password:", error);
    res.status(500).json({ success: false, message: "Failed to generate password" });
  }
};
