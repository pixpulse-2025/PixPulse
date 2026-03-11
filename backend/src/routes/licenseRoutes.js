import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { downloadLicense } from "../controllers/licenseController.js";

const router = express.Router();

router.get("/:orderId/:artworkId/download", protect, downloadLicense);

export default router;
