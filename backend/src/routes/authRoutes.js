/**
 * @file authRoutes.js
 * @description Routes for user authentication and profile management.
 */

import express from "express";
import {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
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
import { uploadAvatar } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ==========================================================================
   PUBLIC ROUTES
   No authentication required to access these endpoints.
   ========================================================================== */

// Register a new user with input validation
router.post("/register", registerValidation, validate, register);

// Log in an existing user with input validation
router.post("/login", loginValidation, validate, login);

// Handle Google OAuth authentication
router.post("/google", googleAuth);

// Initiate forgot password process (sends email)
router.post("/forgot-password", forgotPassword);

// Reset password using a token from the email
router.post("/reset-password/:token", resetPassword);

/* ==========================================================================
   PROTECTED ROUTES
   Requires a valid JWT token in the Authorization header.
   ========================================================================== */

// Get current user's details
router.get("/me", protect, getMe);

// Update current user's profile information with validation
// Using multer to handle optional avatarFile upload safely
router.put("/profile", protect, (req, res, next) => {
    uploadAvatar.single("avatarFile")(req, res, function (err) {
        if (err) {
            // Re-route multer errors or file filter errors correctly to the global handler
            return next(err);
        }
        next();
    });
}, updateProfileValidation, validate, updateProfile);

// Update user password
router.put("/password", protect, updatePassword);

// Log out the current user (token invalidation should be handled on client side)
router.post("/logout", protect, logout);

export default router;
