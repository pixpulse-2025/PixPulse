/**
 * @file authMiddleware.js
 * @description Middleware for protecting routes and handling role-based access control (RBAC).
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes by verifying the JSON Web Token (JWT).
 * It extracts the token from the 'Authorization' header and attaches the user data to 'req.user'.
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header exists and follows the Bearer pattern
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // "Bearer <token>" -> split by space and take the second part
            token = req.headers.authorization.split(" ")[1];
        }

        // Return error if no token is found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        try {
            // Verify the token using the secret key from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database (excluding the password field)
            req.user = await User.findById(decoded.id).select("-password");

            // If user doesn't exist anymore despite a valid token
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found",
                });
            }

            // Move to the next middleware or controller
            next();
        } catch (error) {
            // Handle expired or malformed tokens
            return res.status(401).json({
                success: false,
                message: "Not authorized, token invalid or expired",
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Server error in authentication",
        });
    }
};

/**
 * Middleware to restrict access to Admin-only routes.
 * Must be used AFTER the 'protect' middleware to ensure 'req.user' is populated.
 */
export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Not authorized as admin",
        });
    }
};

/**
 * Middleware to restrict access to Artist or Admin-only routes.
 * Must be used AFTER the 'protect' middleware.
 */
export const artist = (req, res, next) => {
    if (req.user && (req.user.role === "artist" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Not authorized as artist",
        });
    }
};
