import Order from "../models/Order.js";
import Artwork from "../models/Artwork.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handles the secure streaming/download of an artwork file.
 * Verifies that the user has either purchased the artwork or it is free.
 * @route GET /api/download/:artworkId
 * @access Private
 */
export const secureDownload = async (req, res) => {
    try {
        const { artworkId } = req.params;

        // Find artwork
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check if user owns this artwork (either purchased or is the artist)
        const userId = req.user._id;
        const artistId = artwork.artist;
        let isArtist = false;
        
        // Use Mongoose equals() for safe ObjectId comparison
        if (artistId && userId) {
            if (artistId.equals ? artistId.equals(userId) : String(artistId) === String(userId)) {
                isArtist = true;
            }
        }
        
        // Admin or Free artwork bypass
        if (req.user.role === 'admin' || artwork.price === 0) {
            isArtist = true;
        }

        if (!isArtist) {
            // Check if user has purchased this artwork
            const order = await Order.findOne({
                user: req.user._id,
                paymentStatus: "completed",
                $or: [
                    { "items.artwork": artworkId },
                    { "items.artwork": new mongoose.Types.ObjectId(artworkId) }
                ]
            });

            if (!order) {
                return res.status(403).json({
                    success: false,
                    message: "You must purchase this artwork to download it",
                    _debug: { isArtist, userId, artistId, artworkId }
                });
            }

            // Check if download link has expired
            const downloadLink = order.downloadLinks.find(
                (link) => link.artwork.toString() === artworkId
            );

            if (downloadLink && new Date() > new Date(downloadLink.expiresAt)) {
                return res.status(403).json({
                    success: false,
                    message: "Download link has expired. Please contact support.",
                });
            }
        }

        // Get file path
        const filePath = path.join(path.resolve(), artwork.fileUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server",
            });
        }

        // Set headers for download
        const fileName = path.basename(artwork.fileUrl);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        // Stream file to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Increment download count (only for purchases, not artist downloads)
        if (!isArtist) {
            await Artwork.findByIdAndUpdate(artworkId, {
                $inc: { downloads: 1 },
            });
        }
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Generates a temporary, one-time-use token for downloading an artwork.
 * Useful for providing temporary access links.
 * @route POST /api/download/token/:artworkId
 * @access Private
 */
export const generateDownloadToken = async (req, res) => {
    try {
        const { artworkId } = req.params;

        // Find artwork
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        const userId = req.user._id;
        const artistId = artwork.artist;
        let isArtist = false;
        
        if (artistId && userId) {
            if (artistId.equals ? artistId.equals(userId) : String(artistId) === String(userId)) {
                isArtist = true;
            }
        }
        
        if (req.user.role === 'admin' || artwork.price === 0) {
            isArtist = true;
        }

        if (!isArtist) {
            const order = await Order.findOne({
                user: req.user._id,
                paymentStatus: "completed",
                $or: [
                    { "items.artwork": artworkId },
                    { "items.artwork": new mongoose.Types.ObjectId(artworkId) }
                ]
            });

            if (!order) {
                return res.status(403).json({
                    success: false,
                    message: "You must purchase this artwork to download it",
                    _debug: { isArtist, userId, artistId, artworkId }
                });
            }

            // Check expiration
            const downloadLink = order.downloadLinks.find(
                (link) => link.artwork.toString() === artworkId
            );

            if (downloadLink && new Date() > new Date(downloadLink.expiresAt)) {
                return res.status(403).json({
                    success: false,
                    message: "Download link has expired",
                });
            }
        }

        // Generate temporary token (valid for 1 hour)
        const token = Buffer.from(
            JSON.stringify({
                artworkId,
                userId: req.user._id,
                expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
            })
        ).toString("base64");

        res.status(200).json({
            success: true,
            token,
            downloadUrl: `/api/download/file/${token}`,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Allows downloading a file using a pre-generated temporary token.
 * This endpoint is public so it can be used in dynamic link structures.
 * @route GET /api/download/file/:token
 * @access Public (but requires valid token)
 */
export const downloadWithToken = async (req, res) => {
    try {
        const { token } = req.params;

        // Decode token
        let tokenData;
        try {
            tokenData = JSON.parse(Buffer.from(token, "base64").toString());
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid download token",
            });
        }

        // Check token expiration
        if (Date.now() > tokenData.expiresAt) {
            return res.status(403).json({
                success: false,
                message: "Download token has expired",
            });
        }

        // Get artwork
        const artwork = await Artwork.findById(tokenData.artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Get file path
        const filePath = path.join(path.resolve(), artwork.fileUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server",
            });
        }

        // Set headers for download
        const fileName = path.basename(artwork.fileUrl);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        // Stream file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Increment download count
        await Artwork.findByIdAndUpdate(tokenData.artworkId, {
            $inc: { downloads: 1 },
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Checks if the currently authenticated user is eligible to download a specific artwork.
 * Returns true if the artwork is free or the user has a completed order for it.
 * @route GET /api/download/check/:artworkId
 * @access Private
 */
export const checkDownloadEligibility = async (req, res) => {
    try {
        const { artworkId } = req.params;

        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check if user is the artist
        const userId = req.user._id;
        const artistId = artwork.artist;
        let isArtist = false;
        
        if (artistId && userId) {
            if (artistId.equals ? artistId.equals(userId) : String(artistId) === String(userId)) {
                isArtist = true;
            }
        }
        
        if (req.user.role === 'admin' || artwork.price === 0) {
            isArtist = true;
        }

        if (isArtist) {
            return res.status(200).json({
                success: true,
                eligible: true,
                reason: "artist",
            });
        }

        // Check if purchased
        const order = await Order.findOne({
            user: req.user._id,
            paymentStatus: "completed",
            $or: [
                { "items.artwork": artworkId },
                { "items.artwork": new mongoose.Types.ObjectId(artworkId) }
            ]
        });

        if (!order) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: "not_purchased",
                _debug: { isArtist, userId, artistId, artworkId }
            });
        }

        // Check expiration
        const downloadLink = order.downloadLinks.find(
            (link) => link.artwork.toString() === artworkId
        );

        if (downloadLink && new Date() > new Date(downloadLink.expiresAt)) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: "expired",
                expiresAt: downloadLink.expiresAt,
            });
        }

        res.status(200).json({
            success: true,
            eligible: true,
            reason: "purchased",
            expiresAt: downloadLink?.expiresAt,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};
