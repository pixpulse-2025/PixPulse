import express from "express";
import {
    secureDownload,
    generateDownloadToken,
    downloadWithToken,
    checkDownloadEligibility,
} from "../controllers/downloadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/check/:artworkId", protect, checkDownloadEligibility);
router.get("/:artworkId", protect, secureDownload);
router.post("/token/:artworkId", protect, generateDownloadToken);

// Public route (but requires valid token)
router.get("/file/:token", downloadWithToken);

export default router;
