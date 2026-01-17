/**
 * @file reportRoutes.js
 * @description Routes for flagging and managing reported content.
 */

import express from "express";
import {
    reportArtwork,
    getMyReports,
    getAllReports,
    updateReportStatus,
    deleteReport,
    getArtworkReports,
} from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================================
   USER ROUTES
   Endpoints available to all registered users.
   ========================================================================== */

// Submit a new report for an artwork
router.post("/:artworkId", protect, reportArtwork);

// Fetch all reports submitted by the logged-in user
router.get("/my-reports", protect, getMyReports);

/* ==========================================================================
   ADMIN ROUTES
   Restricted to users with the 'admin' role.
   ========================================================================== */

// Fetch all reports in the system for moderation
router.get("/", protect, admin, getAllReports);

// Fetch all reports associated with a specific artwork
router.get("/artwork/:artworkId", protect, admin, getArtworkReports);

// Update status of a report (e.g., mark as 'resolved' or 'dismissed')
router.patch("/:reportId", protect, admin, updateReportStatus);

// Delete a report from the system
router.delete("/:reportId", protect, admin, deleteReport);

export default router;
