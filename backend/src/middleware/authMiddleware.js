import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ======================
   Protect routes - Verify JWT token
====================== */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found",
                });
            }

            next();
        } catch (error) {
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

/* ======================
   Admin middleware - Check if user is admin
====================== */
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

/* ======================
   Artist middleware - Check if user is artist or admin
====================== */
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
