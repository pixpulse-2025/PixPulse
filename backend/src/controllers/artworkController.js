import Artwork from "../models/Artwork.js";

/* ======================
   @desc    Upload new artwork
   @route   POST /api/artworks
   @access  Private
====================== */
export const createArtwork = async (req, res, next) => {
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

        if (!req.file) {
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
        // For images, use the uploaded file itself
        // For other types, use a placeholder (in a real app, you'd generate a thumbnail)
        let previewUrl = `/uploads/artworks/${req.file.filename}`;

        if (!req.file.mimetype.startsWith("image/")) {
            // Logic for non-image previews (placeholder for now)
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
            fileUrl: `/uploads/artworks/${req.file.filename}`,
            previewUrl: previewUrl,
            fileFormat: req.file.mimetype,
            fileSize: req.file.size,
            artist: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Get all artworks (with filtering)
   @route   GET /api/artworks
   @access  Public
====================== */
export const getArtworks = async (req, res, next) => {
    try {
        const { category, priceType, sort, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (priceType) query.priceType = priceType;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        let artworksQuery = Artwork.find(query).populate("artist", "name avatar");

        // Sorting
        if (sort === "newest") {
            artworksQuery = artworksQuery.sort("-createdAt");
        } else if (sort === "popular") {
            artworksQuery = artworksQuery.sort("-views");
        } else if (sort === "price_low") {
            artworksQuery = artworksQuery.sort("price");
        } else if (sort === "price_high") {
            artworksQuery = artworksQuery.sort("-price");
        } else {
            artworksQuery = artworksQuery.sort("-createdAt");
        }

        const artworks = await artworksQuery;

        res.status(200).json({
            success: true,
            count: artworks.length,
            data: artworks,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Get single artwork
   @route   GET /api/artworks/:id
   @access  Public
====================== */
export const getArtworkById = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id).populate("artist", "name avatar bio");

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Increment views
        artwork.views += 1;
        await artwork.save();

        res.status(200).json({
            success: true,
            data: artwork,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Get artworks by artist (user)
   @route   GET /api/artworks/my-uploads
   @access  Private
====================== */
export const getMyArtworks = async (req, res, next) => {
    try {
        const artworks = await Artwork.find({ artist: req.user._id }).sort("-createdAt");

        res.status(200).json({
            success: true,
            count: artworks.length,
            data: artworks,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Update artwork
   @route   PUT /api/artworks/:id
   @access  Private
====================== */
export const updateArtwork = async (req, res, next) => {
    try {
        let artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString()) {
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
        next(error);
    }
};

/* ======================
   @desc    Toggle artwork visibility
   @route   PATCH /api/artworks/:id/visibility
   @access  Private
====================== */
export const toggleArtworkVisibility = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString()) {
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
        next(error);
    }
};

/* ======================
   @desc    Delete artwork
   @route   DELETE /api/artworks/:id
   @access  Private
====================== */
export const deleteArtwork = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check ownership
        if (artwork.artist.toString() !== req.user._id.toString()) {
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
        next(error);
    }
};
