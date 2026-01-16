import express from "express";
import {
    reportArtwork,
    getMyReports,
    getAllReports,
    updateReportStatus,
    deleteReport,
    getArtworkReports,
} from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/:artworkId", protect, reportArtwork);
router.get("/my-reports", protect, getMyReports);

// Admin routes (uncomment when admin middleware is ready)
// router.get("/", protect, authorize("admin"), getAllReports);
// router.get("/artwork/:artworkId", protect, authorize("admin"), getArtworkReports);
// router.patch("/:reportId", protect, authorize("admin"), updateReportStatus);
// router.delete("/:reportId", protect, authorize("admin"), deleteReport);

export default router;
