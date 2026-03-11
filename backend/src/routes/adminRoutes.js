import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    getDashboardStats,
    getAllTransactions,
    getAllOrders,
    getAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard stats
router.get("/admin/stats", protect, admin, getDashboardStats);

// Admin analytics
router.get("/admin/analytics", protect, admin, getAnalytics);

// Admin transaction history with revenue breakdown
router.get("/admin/transactions", protect, admin, getAllTransactions);

// Admin all orders
router.get("/admin/orders", protect, admin, getAllOrders);

export default router;
