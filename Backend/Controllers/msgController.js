// // controllers/sendMessageController.js

// import fetch from "node-fetch";
// import {logMessage} from "../Models/msgModel";

// export const sendMessageController = async (req, res) => {
//   const { userId, prospectId, phone, content } = req.body;
//   const token = process.env.GEEZSMS_TOKEN;

//   try {
//     // Send SMS
//     const url = `https://api.geezsms.com/api/v1/sms/send?token=${token}&phone=${encodeURIComponent(phone)}&msg=${encodeURIComponent(content)}`;
//     const response = await fetch(url, { method: "GET" });
//     const result = await response.json();

//     // if (result.status !== "success") {
//     //   return res.status(500).json({
//     //     success: false,
//     //     message: "SMS failed to send",
//     //     details: result,
//     //   });
//     // }

//     // Log to DB
//     const dbMessage = await logMessage({ userId, prospectId, content, phone, created_at });

//     res.status(200).json({
//     success: true,
//     message: "SMS sent and logged successfully",
//     data: {
//         messageId: dbMessage.messageId,
//         to: dbMessage.phone_number,
//         content: dbMessage.content,
//         phone: dbMessage.phone,
//         created_at: dbMessage.created_at,
//     },
//     });

//   } catch (error) {
//     console.error("Send message error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send and log message",
//       error: error.message,
//     });
//   }
// };
