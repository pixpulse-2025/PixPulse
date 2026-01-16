import express from "express";
import {
    addToCart,
    removeFromCart,
    getCart,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.get("/", protect, getCart);
router.post("/:artworkId", protect, addToCart);
router.delete("/clear", protect, clearCart);
router.delete("/:itemId", protect, removeFromCart);

export default router;
