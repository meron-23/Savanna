import {
  createUser,
  updateUser,
  viewUser,
  deleteUserModel,
  findUserByEmail,
  getUserById,
  generateUserId,
  findUserByToken
} from "../Models/userModel.js";
import argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const addUser = async (req, res) => {
  const { name, email, password, phoneNumber, gender, role, supervisor } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await argon2.hash(password);
    const userId = generateUserId();
    const creationTime = new Date();
    const lastSignInTime = new Date();

    await createUser(
      userId, 
      name, 
      email, 
      hashedPassword, 
      phoneNumber, 
      gender, 
      role, 
      supervisor, 
      creationTime, 
      lastSignInTime
    );

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Update last sign-in time
    await updateUser(user.userId, { lastSignInTime: new Date() });

    const token = generateToken(user);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000 // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();
    const defaultRole = 'Agent';

    let user = await findUserByEmail(email);
    
    if (!user) {
      const userId = generateUserId();
      const creationTime = new Date();
      const lastSignInTime = new Date();
      
      // Create user with empty password for Google auth
      await createUser(
        userId,
        name,
        email,
        '', // Empty password for Google auth
        '', // phoneNumber
        '', // gender
        defaultRole,
        '', // supervisor
        creationTime,
        lastSignInTime
      );
      
      user = await findUserByEmail(email);
    }

    const authToken = generateToken(user);

    res.cookie('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: picture || null
      },
      token: authToken
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during Google login" 
    });
  }
};

export const verifyToken = (req, res) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ 
      valid: true,
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
};

export const fetchUserByToken = async (req, res) => {
  const { token } = req.params; // or req.body if you send via POST

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const user = await findUserByToken(token);

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid or expired token" });
    }

    res.status(200).json({ success: true, message: "User found", data: user });
  } catch (error) {
    console.error("Error fetching user by token:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Other user controller functions remain the same...
export const getUser = async (req, res) => {
  try {
    const users = await viewUser();
    res.status(200).json({ success: true, message: "Success", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Success", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const putUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber } = req.body;
  try {
    const result = await updateUser(id, name, email, phoneNumber);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteUserModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};