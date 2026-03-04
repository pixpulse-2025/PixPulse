import express from "express";
import { recognizeSketch } from "../controllers/sketchController.js";

const router = express.Router();

// POST /api/sketch/recognize
// Accepts base64 sketch image, returns recognized label + search term
router.post("/recognize", recognizeSketch);

export default router;
