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

// User routes
router.post("/:artworkId", protect, reportArtwork);
router.get("/my-reports", protect, getMyReports);

// Admin routes
router.get("/", protect, admin, getAllReports);
router.get("/artwork/:artworkId", protect, admin, getArtworkReports);
router.patch("/:reportId", protect, admin, updateReportStatus);
router.delete("/:reportId", protect, admin, deleteReport);

export default router;
