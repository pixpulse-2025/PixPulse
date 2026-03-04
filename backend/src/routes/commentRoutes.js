/**
 * @file commentRoutes.js
 * @description Routes for community comments.
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getComments,
    createComment,
    deleteComment,
    toggleLikeComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Public
router.get("/", getComments);

// Protected
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);
router.patch("/:id/like", protect, toggleLikeComment);

export default router;
