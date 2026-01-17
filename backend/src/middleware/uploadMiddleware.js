/**
 * @file uploadMiddleware.js
 * @description Middleware for handling file uploads using Multer. Supports various file formats for artworks.
 */

import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Ensure that the base 'uploads/artworks' directory exists on the server.
 * Creates it recursively if it does not exist.
 */
const uploadDir = "uploads/artworks";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configure storage settings for Multer.
 * Defines the destination folder and the naming convention for uploaded files.
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination path for the uploaded files
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and a random number
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

/**
 * Filter for allowed file types.
 * Rejects files that do not match the specified extensions.
 */
const fileFilter = (req, file, cb) => {
    // List of allowed file extensions across images, audio, video, and presets
    const allowedExtensions = [
        ".jpg", ".jpeg", ".png",     // Images
        ".mp3", ".flp",             // Music/Project files
        ".mp4", ".mov", ".ffx",     // Video/After Effects
        ".xmp", ".abr"              // Presets
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    // Check if the uploaded file's extension is in the allowed list
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file format"), false);
    }
};

/**
 * Multer middleware instance for handling artwork uploads.
 * Includes storage configuration, file filtering, and size limits.
 */
export const uploadArtwork = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // Maximum file size: 50MB
    },
});
