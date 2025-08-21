import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel,
  findUserByEmail,
  getUserById,
  generateUserId
} from "../Models/userModel.js";
import mySqlConnection from "../Config/db.js";

// import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import argon2 from 'argon2';

export const addUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, gender, role, supervisor } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required fields'
      });
    }

    // Generate a random password if not provided
    const randomPassword = '123456';
    const hashedPassword = await argon2.hash(randomPassword);

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
    // Return response without password
    const { password, ...userWithoutPassword } = createdUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword,
      tempPassword: randomPassword // Only for development, remove in production
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email)
  try {
    // 1. Find the user by email
    const user = await findUserByEmail(email);
    console.log(user);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // 2. Check if user registered via Google
    if (user.login_method === 'google') {
      return res.status(403).json({
        success: false,
        message: "This account requires Google login",
        login_method: "google" // Frontend can use this to trigger Google login
      });
    }

    // 3. Verify password (only for email-registered users)
    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // 4. Successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        login_method: user.login_method // Return for frontend reference
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ 
        success: false,
        message: 'Access token is required' 
      });
    }

    // 1. Verify token with Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 
        Authorization: `Bearer ${access_token}` 
      }
    });
    
    if (!response.ok) throw new Error('Google verification failed');
    
     const userInfo = await response.json();
     console.log(userInfo);
    
     // 2. Check if user exists in database
    const email = await findUserByEmail(userInfo.email)
    

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Account not registered'
      });
    }

    console.log(email);
    // 3. Update last login
    await mySqlConnection.query(
      'UPDATE users SET lastSignInTime = NOW() WHERE userId = ?',
      [email.userId]
    );
    await mySqlConnection.query(
        'UPDATE users SET login_method = "google" WHERE userId = ?',
        [email.userId]
      );

    // 4. Return user data
    const { password, ...safeUser } = email;
    res.json({ 
      success: true,
      user: safeUser 
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || 'Authentication failed'
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
