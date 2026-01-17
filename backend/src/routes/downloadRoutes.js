/**
 * @file downloadRoutes.js
 * @description Routes for handling secure downloads of purchased artworks.
 */

import express from "express";
import {
    secureDownload,
    generateDownloadToken,
    downloadWithToken,
    checkDownloadEligibility,
} from "../controllers/downloadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================================
   PROTECTED ROUTES
   Requires authenticating the user to check ownership/eligibility.
   ========================================================================== */

// Check if the current user is eligible to download a specific artwork (purchased or free)
router.get("/check/:artworkId", protect, checkDownloadEligibility);

// Direct secure download (checks auth and returns file stream)
router.get("/:artworkId", protect, secureDownload);

// Generate a temporary, one-time-use token for downloading an artwork
router.post("/token/:artworkId", protect, generateDownloadToken);

/* ==========================================================================
   PUBLIC ROUTES
   Accessible without login BUT requires a valid, pre-generated token.
   ========================================================================== */

// Download the file using a temporary token
router.get("/file/:token", downloadWithToken);

export default router;
