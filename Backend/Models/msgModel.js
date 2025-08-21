import mySqlConnection from '../Config/db.js';

// Create a new message
const createMessage = async (userId, prospectId, content, phone_number, created_at, comment, status) => {
  const sql = `INSERT INTO messages (userId, prospectId, content, phone_number, created_at, comment, status)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await mySqlConnection.query(sql, [userId, prospectId, content, phone_number, created_at, comment, status]);
    return result;
  } catch (error) {
    console.error("Create Message Error:", error);
    throw error;
  }
};

// Get all messages
const getAllMessages = async () => {
  const sql = `SELECT * FROM messages ORDER BY created_at DESC`;
  try {
    const [rows] = await mySqlConnection.query(sql);
    return rows;
  } catch (error) {
    console.error("Get All Messages Error:", error);
    throw error;
  }
};

// Get message by ID
const getMessageById = async (messageId) => {
  const sql = `SELECT * FROM messages WHERE messageId = ?`;
  try {
    const [rows] = await mySqlConnection.query(sql, [messageId]);
    return rows[0];
  } catch (error) {
    console.error("Get Message By ID Error:", error);
    throw error;
  }
};

// Get messages by user ID
const getMessagesByUserId = async (userId) => {
  const sql = `SELECT * FROM messages WHERE userId = ? ORDER BY created_at DESC`;
  try {
    const [rows] = await mySqlConnection.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error("Get Messages By User ID Error:", error);
    throw error;
  }
};

// Get messages by prospect ID
const getMessagesByProspectId = async (prospectId) => {
  const sql = `SELECT * FROM messages WHERE prospectId = ? ORDER BY created_at DESC`;
  try {
    const [rows] = await mySqlConnection.query(sql, [prospectId]);
    return rows;
  } catch (error) {
    console.error("Get Messages By Prospect ID Error:", error);
    throw error;
  }
};

// Update message
const updateMessage = async (content, status, messageId) => {
  const sql = `UPDATE messages SET content = ?, status = ? WHERE messageId = ?`;
  try {
    const [result] = await mySqlConnection.query(sql, [content, status, messageId]);
    return result;
  } catch (error) {
    console.error("Update Message Error:", error);
    throw error;
  }
};

const updateCommentAndStatus = async (comment, status, messageId) => {
  const sql = `UPDATE messages SET comment = ?, status=? WHERE messageId = ?`;
  try {
    const [result] = await mySqlConnection.query(sql, [comment, status, messageId]);
    return result;
  } catch (error) {
    console.error("Update Message Error:", error);
    throw error;
  }
};

const updateApproveMessageStatus = async (status, messageId) => {
  const sql = `UPDATE messages SET status = ? WHERE messageId = ?`;
  try {
    const [result] = await mySqlConnection.query(sql, [status, messageId]);
    return result;
  } catch (error) {
    console.error("Update Message Status Error:", error);
    throw error;
  }
};


// Delete message
const deleteMessage = async (messageId) => {
  const sql = `DELETE FROM messages WHERE messageId = ?`;
  try {
    const [result] = await mySqlConnection.query(sql, [messageId]);
    return result;
  } catch (error) {
    console.error("Delete Message Error:", error);
    throw error;
  }
};

export {
  createMessage,
  getAllMessages,
  getMessageById,
  getMessagesByUserId,
  getMessagesByProspectId,
  updateMessage,
  updateCommentAndStatus,
  updateApproveMessageStatus,
  deleteMessage
};