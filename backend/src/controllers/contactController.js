import { sendContactUsEmail } from "../utils/emailService.js";
import Message from "../models/Message.js";

// @desc    Submit contact us form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required"
            });
        }

        // Save to database
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });

        // Send contact us email
        await sendContactUsEmail(name, email, subject, message);

        res.status(200).json({
            success: true,
            message: "Successfully sent contact message"
        });
    } catch (error) {
        console.error("Contact Form error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update message status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        message.status = status;
        await message.save();

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        await message.deleteOne();

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
