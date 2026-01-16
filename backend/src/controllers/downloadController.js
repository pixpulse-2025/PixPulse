import Order from "../models/Order.js";
import Artwork from "../models/Artwork.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ======================
   @desc    Secure download artwork file
   @route   GET /api/download/:artworkId
   @access  Private
====================== */
export const secureDownload = async (req, res, next) => {
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
        const isArtist = artwork.artist.toString() === req.user._id.toString();

        if (!isArtist) {
            // Check if user has purchased this artwork
            const order = await Order.findOne({
                user: req.user._id,
                "items.artwork": artworkId,
                paymentStatus: "completed",
            });

            if (!order) {
                return res.status(403).json({
                    success: false,
                    message: "You must purchase this artwork to download it",
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
        next(error);
    }
};

/* ======================
   @desc    Generate temporary download token
   @route   POST /api/download/token/:artworkId
   @access  Private
====================== */
export const generateDownloadToken = async (req, res, next) => {
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
        const isArtist = artwork.artist.toString() === req.user._id.toString();

        if (!isArtist) {
            const order = await Order.findOne({
                user: req.user._id,
                "items.artwork": artworkId,
                paymentStatus: "completed",
            });

            if (!order) {
                return res.status(403).json({
                    success: false,
                    message: "You must purchase this artwork to download it",
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
        next(error);
    }
};

/* ======================
   @desc    Download with token
   @route   GET /api/download/file/:token
   @access  Public (but requires valid token)
====================== */
export const downloadWithToken = async (req, res, next) => {
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
        next(error);
    }
};

/* ======================
   @desc    Check download eligibility
   @route   GET /api/download/check/:artworkId
   @access  Private
====================== */
export const checkDownloadEligibility = async (req, res, next) => {
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
        const isArtist = artwork.artist.toString() === req.user._id.toString();

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
            "items.artwork": artworkId,
            paymentStatus: "completed",
        });

        if (!order) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: "not_purchased",
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
        next(error);
    }
};
