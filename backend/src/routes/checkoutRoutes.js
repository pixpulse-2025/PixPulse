import express from "express";
import {
    createOrder,
    completeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
} from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.post("/", protect, createOrder);
router.post("/complete/:orderId", protect, completeOrder);
router.get("/orders", protect, getMyOrders);
router.get("/orders/:orderId", protect, getOrderById);
router.patch("/orders/:orderId/cancel", protect, cancelOrder);

export default router;
