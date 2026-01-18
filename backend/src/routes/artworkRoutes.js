/**
 * @file artworkRoutes.js
 * @description Routes for managing artworks (upload, fetch, update, delete).
 */

import express from "express";
import {
   createArtwork,
   getArtworks,
   getArtworkById,
   getMyArtworks,
   updateArtwork,
   toggleArtworkVisibility,
   deleteArtwork,
} from "../controllers/artworkController.js";
import { protect, identifyUser } from "../middleware/authMiddleware.js";
import { uploadArtwork } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ==========================================================================
   PUBLIC ROUTES
   Available to all users (visitors and registered users).
   ========================================================================== */

// Fetch all public artworks with optional filters (search, category, etc.)
router.get("/", getArtworks);

// Fetch details of a single artwork by its ID (two routes for compatibility)
// Fetch artworks uploaded by the currently logged-in user (MUST be before /:id)
router.get("/my-uploads", protect, getMyArtworks);

// Fetch details of a single artwork by its ID (two routes for compatibility)
router.get("/single/:id", identifyUser, getArtworkById);
router.get("/:id", identifyUser, getArtworkById);

/* ==========================================================================
   PRIVATE ROUTES
   Access restricted to authenticated users.
   ========================================================================== */

// Upload a new artwork (handles multiple file types via uploadArtwork middleware)
router.post("/", protect, uploadArtwork.single("file"), createArtwork);



// Update details of an existing artwork
router.put("/:id", protect, updateArtwork);

// Toggle visibility (public/private) of an artwork
router.patch("/:id/visibility", protect, toggleArtworkVisibility);

// Delete an artwork
router.delete("/:id", protect, deleteArtwork);

export default router;
