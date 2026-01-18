import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard stats
router.get("/admin/stats", protect, admin, getDashboardStats);

// User management routes
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);
router.patch("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

export default router;
