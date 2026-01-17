/**
 * @file favoriteRoutes.js
 * @description Routes for managing user's favorite artworks.
 */

import express from "express";
import {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    checkFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================================
   PROTECTED ROUTES
   All favorite operations require the user to be logged in.
   ========================================================================== */

// Get all artworks favorited by the logged-in user
router.get("/", protect, getFavorites);

// Check if a specific artwork is favorited by the current user
router.get("/check/:artworkId", protect, checkFavorite);

// Add an artwork to the user's favorites list
router.post("/:artworkId", protect, addToFavorites);

// Remove an artwork from the user's favorites list
router.delete("/:artworkId", protect, removeFromFavorites);

export default router;
