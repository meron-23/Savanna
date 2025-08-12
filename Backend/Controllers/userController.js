import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel,
  findUserByEmail,
  getUserById,
  generateUserId
} from "../Models/userModel.js";

// import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import argon2 from 'argon2';

export const addUser = async (req, res, next) => {
  const { name, email, password, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this email already exists." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await argon2.hash(password);

    // Generate a new user ID
    const userId = generateUserId();

    // Pass the hashed password to the createUser function
    const result = await createUser(userId, name, email, hashedPassword, phoneNumber, gender, role, supervisor, new Date(), new Date());
    
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email using the new function
    const user = await findUserByEmail(email);
    
    if (!user) {
      // User not found
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Verify the provided password against the stored hash
    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) {
      // Passwords do not match
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // If login is successful
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

export const googleLogin = async (req, res) => {
  const { email, name, googleId, picture } = req.body;

  if (!email || !googleId) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and Google ID are required" 
    });
  }

  try {
    // Check if user exists by email
    let user = await findUserByEmail(email);
    
    if (!user) {
      // Create new user for Google login
      const userId = generateUserId();
      const defaultRole = 'Agent';
      
      // Generate a random password for Google-authenticated users
      // (since your createUser requires a password parameter)
      // const randomPassword = crypto.randomBytes(16).toString('hex');
      
      // Call createUser with required parameters
      await createUser(
        userId,
        name,
        email,
        '', // Using random password since Google doesn't provide one
        '',            // phoneNumber (empty string)
        '',            // gender (empty string)
        defaultRole,   // role
        '',            // supervisor (empty string)
        new Date(),    // creationTime
        new Date()     // lastSignInTime
      );
      
      user = await findUserByEmail(email);
    } else if (user.googleId && user.googleId !== googleId) {
      return res.status(401).json({ 
        success: false, 
        message: "This email is already registered with a different login method" 
      });
    }

    // Successful login
    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during Google login" 
    });
  }
};



export const verifyToken = (req, res, next) => {
  // const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ valid: false });

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ 
      valid: true,
      user: {
        id: decoded.id,
        name: decoded.username,
        role: decoded.role
      }
    });

    // next();
  } catch (err) {
    res.status(401).json({ valid: false });
  }
};

// controllers/authController.js

export const logoutUser = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
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
