import express from "express";
import { submitContactForm, getMessages, updateMessageStatus, deleteMessage } from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(submitContactForm).get(protect, admin, getMessages);
router.route("/:id").patch(protect, admin, updateMessageStatus).delete(protect, admin, deleteMessage);

export default router;
