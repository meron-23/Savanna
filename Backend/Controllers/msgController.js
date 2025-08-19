import { 
  createMessage, 
  getAllMessages, 
  getMessageById, 
  getMessagesByUserId, 
  getMessagesByProspectId, 
  updateMessage, 
  deleteMessage, 
  updateCommentAndStatus,
  updateApproveMessageStatus
} from '../Models/msgModel.js';

// import { v4 as uuidv4 } from 'uuid';

// Create a new message
export const addMessage = async (req, res) => {
  const { userId, prospectId, content, phone_number, created_at, comment, status } = req.body;
  
  // Generate a unique messageId (28 characters like CHAR(28))
//   const messageId = uuidv4().replace(/-/g, '').substring(0, 28);

  try {
    const result = await createMessage(userId, prospectId, content, phone_number, created_at, comment, status);
    res.status(201).json({ 
      success: true, 
      message: "Message created successfully", 
    });
  } catch (error) {
    console.error("Add Message Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all messages
export const getAllMessagesController = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("Get All Messages Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get message by ID
export const getMessageByIdController = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await getMessageById(messageId);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error("Get Message By ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get messages by user ID
export const getMessagesByUserIdController = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await getMessagesByUserId(userId);
    res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("Get Messages By User ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get messages by prospect ID
export const getMessagesByProspectIdController = async (req, res) => {
  const { prospectId } = req.params;

  try {
    const messages = await getMessagesByProspectId(prospectId);
    res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("Get Messages By Prospect ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Update message
export const updateMessageController = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const result = await updateMessage(content, messageId, );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Message updated successfully" 
    });
  } catch (error) {
    console.error("Update Message Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const approveMessageController = async (req, res) => {
  const { messageId } = req.params;
  const { phone, message } = req.body;
  const token = process.env.GEEZSMS_TOKEN;

  if (!phone || !message || !messageId) {
    return res.status(400).json({
      success: false,
      message: "Phone, message, and messageId are required",
    });
  }

  try {
    // const url = `https://api.geezsms.com/api/v1/sms/send?token=${token}&phone=${encodeURIComponent(phone)}&msg=${encodeURIComponent(message)}`;
    // const response = await fetch(url, { method: "GET" });
    // const result = await response.json();

    // if (result.status !== "success") {
    //   return res.status(500).json({
    //     success: false,
    //     message: "SMS failed to send",
    //     details: result,
    //   });
    // }

    await updateApproveMessageStatus("approved", messageId);

    res.status(200).json({
      success: true,
      message: "SMS sent and message status updated",
      data: {
        to: phone,
        content: message,
        messageId,
        // providerResponse: result,
      },
    });
  } catch (error) {
    console.error("Approve Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const updateCommentController = async (req, res) => {
  const { messageId } = req.params;
  const { comment, status } = req.body;

  try {
    const result = await updateCommentAndStatus(comment, status, messageId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Message updated successfully" 
    });
  } catch (error) {
    console.error("Update Message Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Delete message
export const deleteMessageController = async (req, res) => {
  const { messageId } = req.params;

  try {
    const result = await deleteMessage(messageId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Message deleted successfully" 
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};