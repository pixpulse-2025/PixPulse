import express from "express";
import {
    register,
    login,
    getMe,
    updateProfile,
    logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfileValidation, validate, updateProfile);
router.post("/logout", protect, logout);

export default router;
