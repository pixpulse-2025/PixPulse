import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getTopCreators,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.get("/top-creators", getTopCreators);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.patch("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
