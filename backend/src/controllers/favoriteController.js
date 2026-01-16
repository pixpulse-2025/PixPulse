import Favorite from "../models/Favorite.js";
import Artwork from "../models/Artwork.js";

/* ======================
   @desc    Add artwork to favorites
   @route   POST /api/favorites/:artworkId
   @access  Private
====================== */
export const addToFavorites = async (req, res, next) => {
    try {
        const { artworkId } = req.params;

        // Check if artwork exists
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user: req.user._id,
            artwork: artworkId,
        });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: "Artwork already in favorites",
            });
        }

        // Create favorite
        const favorite = await Favorite.create({
            user: req.user._id,
            artwork: artworkId,
        });

        res.status(201).json({
            success: true,
            data: favorite,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Remove artwork from favorites
   @route   DELETE /api/favorites/:artworkId
   @access  Private
====================== */
export const removeFromFavorites = async (req, res, next) => {
    try {
        const { artworkId } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            user: req.user._id,
            artwork: artworkId,
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Removed from favorites",
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Get user's favorites
   @route   GET /api/favorites
   @access  Private
====================== */
export const getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate({
                path: "artwork",
                populate: {
                    path: "artist",
                    select: "name avatar",
                },
            })
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================
   @desc    Check if artwork is favorited
   @route   GET /api/favorites/check/:artworkId
   @access  Private
====================== */
export const checkFavorite = async (req, res, next) => {
    try {
        const { artworkId } = req.params;

        const favorite = await Favorite.findOne({
            user: req.user._id,
            artwork: artworkId,
        });

        res.status(200).json({
            success: true,
            isFavorited: !!favorite,
        });
    } catch (error) {
        next(error);
    }
};
