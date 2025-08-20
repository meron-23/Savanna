import mySqlConnection from "../Config/db.js";
import { nanoid } from "nanoid";

const logMessage = async ({ userId, prospectId, content, phone }) => {
  const messageId = nanoid(28);
  const insertSql = `
    INSERT INTO messages (messageId, userId, prospectId, content, phone_number)
    VALUES (?, ?, ?, ?, ?)
    `;


  try {
    const [result] = await mySqlConnection.query(insertSql, [
        messageId,
        userId,
        prospectId,
        content,
        phone,
        created_at
    ]);
    return { messageId, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("Error inserting message:", error);
    throw error;
  }
};

export {
  logMessage,
}