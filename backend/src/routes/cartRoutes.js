/**
 * @file cartRoutes.js
 * @description Routes for managing the user's shopping cart.
 */

import express from "express";
import {
    addToCart,
    removeFromCart,
    getCart,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================================
   PROTECTED ROUTES
   All cart operations require the user to be logged in.
   ========================================================================== */

// Get all items currently in the logged-in user's cart
router.get("/", protect, getCart);

// Add a specific artwork to the user's cart
router.post("/:artworkId", protect, addToCart);

// Remove all items from the user's cart
router.delete("/clear", protect, clearCart);

// Remove a single specific item from the user's cart by its CartItem ID
router.delete("/:itemId", protect, removeFromCart);

export default router;
