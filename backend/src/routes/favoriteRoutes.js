import express from "express";
import {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    checkFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.get("/", protect, getFavorites);
router.get("/check/:artworkId", protect, checkFavorite);
router.post("/:artworkId", protect, addToFavorites);
router.delete("/:artworkId", protect, removeFromFavorites);

export default router;
