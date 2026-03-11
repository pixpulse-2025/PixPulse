/**
 * @file artworkController.js
 * @description Controller for managing artwork uploads, discovery, and administration.
 */

import Artwork from "../models/Artwork.js";

/**
 * Creates and saves a new artwork.
 * Handles metadata processing and links the artwork to the authenticated artist.
 * @route POST /api/artworks
 * @access Private
 */
export const createArtwork = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            subCategory,
            priceType,
            price,
            tags,
            licenseType,
        } = req.body;

        const mainFile = req.files?.file ? req.files.file[0] : null;
        const previewFile = req.files?.preview ? req.files.preview[0] : null;

        if (!mainFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        // Process tags if they come as a string
        let tagsArray = [];
        if (tags) {
            tagsArray = tags.split(",").map((tag) => tag.trim());
        }

        // Generate preview URL
        let previewUrl;

        if (previewFile) {
            // Use explicitly uploaded preview
            previewUrl = `/uploads/artworks/${previewFile.filename}`;
        } else if (mainFile.mimetype.startsWith("image/")) {
            // For images, use the uploaded file itself as preview
            previewUrl = `/uploads/artworks/${mainFile.filename}`;
        } else {
            // For other types without custom preview, use placeholder
            previewUrl = "/uploads/placeholders/default-preview.png";
        }

        const artwork = await Artwork.create({
            title,
            description,
            category,
            subCategory,
            priceType,
            price: priceType === "Free" ? 0 : price,
            tags: tagsArray,
            licenseType,
            fileUrl: `/uploads/artworks/${mainFile.filename}`,
            previewUrl: previewUrl,
            fileFormat: mainFile.mimetype,
            fileSize: mainFile.size,
            artist: req.user._id,
        });


        res.status(201).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves a list of artworks based on filters (search query, category, price type).
 * Supports full-text search and sorting by date, views, and price.
 * @route GET /api/artworks
 * @access Public
 */
export const getArtworks = async (req, res) => {
    try {
        const { category, subCategory, priceType, priceRange, sort, search } = req.query;
        let query = {};

        // Only show public artworks unless the user is an admin
        if (!req.user || req.user.role !== 'admin') {
            query.isPublic = true;
        }

        if (category && category !== 'all') query.category = category;
        if (subCategory && subCategory !== 'all') query.subCategory = subCategory;

        // Price Filtering
        if (priceRange) {
            switch (priceRange) {
                case 'free':
                    query.price = 0;
                    break;
                case 'under-10':
                    query.price = { $lt: 10, $gt: 0 };
                    break;
                case '10-50':
                    query.price = { $gte: 10, $lte: 50 };
                    break;
                case '50-100':
                    query.price = { $gte: 50, $lte: 100 };
                    break;
                case 'over-100':
                    query.price = { $gt: 100 };
                    break;
                default:
                    break;
            }
        } else if (priceType && priceType !== 'all') {
            query.priceType = priceType;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        let artworksQuery = Artwork.find(query).populate("artist", "name avatar");

        // Sorting
        switch (sort) {
            case 'newest':
                artworksQuery = artworksQuery.sort("-createdAt");
                break;
            case 'oldest':
                artworksQuery = artworksQuery.sort("createdAt");
                break;
            case 'popular':
            case 'most-viewed':
                artworksQuery = artworksQuery.sort("-views");
                break;
            case 'most-downloaded':
                artworksQuery = artworksQuery.sort("-downloads");
                break;
            case 'price_low':
            case 'price-low':
                artworksQuery = artworksQuery.sort("price");
                break;
            case 'price_high':
            case 'price-high':
                artworksQuery = artworksQuery.sort("-price");
                break;
            default:
                artworksQuery = artworksQuery.sort("-createdAt");
        }

        const artworks = await artworksQuery;

        res.status(200).json({
            success: true,
            count: artworks.length,
            artworks: artworks,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves the details of a single artwork by its unique ID.
 * Increments the view count for the artwork on each retrieval.
 * @route GET /api/artworks/:id
 * @access Public
 */
export const getArtworkById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id).populate("artist", "name avatar bio");

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Increment views unique to user
        let shouldIncrement = true;

        if (req.user) {
            // Check if user has already viewed
            const alreadyViewed = artwork.viewedBy.some(
                (id) => id.toString() === req.user._id.toString()
            );
            if (alreadyViewed) {
                shouldIncrement = false;
            } else {
                artwork.viewedBy.push(req.user._id);
            }
        }

        if (shouldIncrement) {
            artwork.views += 1;
            await artwork.save();
        }

        res.status(200).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves all artworks uploaded by the currently authenticated user.
 * @route GET /api/artworks/my-uploads
 * @access Private
 */
export const getMyArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find({ artist: req.user._id }).sort("-createdAt");

        res.status(200).json({
            success: true,
            count: artworks.length,
            data: artworks,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Updates an existing artwork's details.
 * Ensures that only the owner (the artist) can update their artwork.
 * @route PUT /api/artworks/:id
 * @access Private
 */
export const updateArtwork = async (req, res) => {
    try {
        let artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this artwork",
            });
        }

        const { title, description, priceType, price, tags, licenseType } = req.body;

        // Process tags if they come as a string
        let tagsArray = artwork.tags;
        if (tags) {
            tagsArray = typeof tags === 'string' ? tags.split(",").map((tag) => tag.trim()) : tags;
        }

        artwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            {
                title: title || artwork.title,
                description: description || artwork.description,
                priceType: priceType || artwork.priceType,
                price: priceType === "Free" ? 0 : (price || artwork.price),
                tags: tagsArray,
                licenseType: licenseType || artwork.licenseType,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Toggles whether an artwork is public or private.
 * @route PATCH /api/artworks/:id/visibility
 * @access Private
 */
export const toggleArtworkVisibility = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to modify this artwork",
            });
        }

        artwork.isPublic = !artwork.isPublic;
        await artwork.save();

        res.status(200).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Deletes an artwork from the system.
 * Verifies that the requester is the owner of the artwork.
 * @route DELETE /api/artworks/:id
 * @access Private
 */
export const deleteArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this artwork",
            });
        }

        await artwork.deleteOne();

        res.status(200).json({
            success: true,
            message: "Artwork deleted successfully",
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};
