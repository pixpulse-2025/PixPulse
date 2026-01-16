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
import { protect } from "../middleware/authMiddleware.js";
import { uploadArtwork } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getArtworks);
router.get("/single/:id", getArtworkById);

// Private routes
router.post("/", protect, uploadArtwork.single("file"), createArtwork);
router.get("/my-uploads", protect, getMyArtworks);
router.put("/:id", protect, updateArtwork);
router.patch("/:id/visibility", protect, toggleArtworkVisibility);
router.delete("/:id", protect, deleteArtwork);

export default router;
