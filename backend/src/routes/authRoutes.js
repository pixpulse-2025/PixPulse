import express from "express";
import {
    register,
    login,
    getMe,
    updateProfile,
    logout,
    googleAuth,
    forgotPassword,
    resetPassword,
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
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfileValidation, validate, updateProfile);
router.post("/logout", protect, logout);

export default router;
