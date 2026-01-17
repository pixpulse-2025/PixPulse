/**
 * @file checkoutRoutes.js
 * @description Routes for handling the checkout process and order management.
 */

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

/* ==========================================================================
   PROTECTED ROUTES
   Checkout and order history are only accessible to authenticated users.
   ========================================================================== */

// Initialize a new order from current cart items
router.post("/", protect, createOrder);

// Mark an order as completed (typically called after successful payment)
router.post("/complete/:orderId", protect, completeOrder);

// Fetch a list of all orders made by the logged-in user
router.get("/orders", protect, getMyOrders);

// Fetch details for a specific order by its ID
router.get("/orders/:orderId", protect, getOrderById);

// Cancel an order that is still in processing status
router.patch("/orders/:orderId/cancel", protect, cancelOrder);

export default router;
