import CartItem from "../models/CartItem.js";
import Artwork from "../models/Artwork.js";

/**
 * Adds an artwork to the user's shopping cart.
 * Only paid artworks are allowed in the cart. Checks for duplicates before adding.
 * @route POST /api/cart/:artworkId
 * @access Private
 */
export const addToCart = async (req, res, next) => {
    try {
        const { artworkId } = req.params;
        const { licenseType } = req.body;

        // Check if artwork exists
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Only paid artworks can be added to cart
        if (artwork.priceType === "Free") {
            return res.status(400).json({
                success: false,
                message: "Free artworks cannot be added to cart",
            });
        }

        // Check if already in cart
        const existingItem = await CartItem.findOne({
            user: req.user._id,
            artwork: artworkId,
            licenseType: licenseType || artwork.licenseType,
        });

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Item already in cart",
            });
        }

        // Create cart item
        const cartItem = await CartItem.create({
            user: req.user._id,
            artwork: artworkId,
            price: artwork.price,
            licenseType: licenseType || artwork.licenseType,
        });

        // Populate artwork and artist data
        await cartItem.populate({
            path: "artwork",
            populate: {
                path: "artist",
                select: "name avatar",
            },
        });

        res.status(201).json({
            success: true,
            data: cartItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Removes a specific item from the user's shopping cart.
 * @route DELETE /api/cart/:itemId
 * @access Private
 */
export const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cartItem = await CartItem.findOne({
            _id: itemId,
            user: req.user._id,
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }

        await cartItem.deleteOne();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves all items in the currently authenticated user's shopping cart.
 * Calculates the total price of all items in the cart.
 * @route GET /api/cart
 * @access Private
 */
export const getCart = async (req, res, next) => {
    try {
        const cartItems = await CartItem.find({ user: req.user._id })
            .populate({
                path: "artwork",
                populate: {
                    path: "artist",
                    select: "name avatar",
                },
            })
            .sort("-createdAt");

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);

        res.status(200).json({
            success: true,
            count: cartItems.length,
            total: total,
            data: cartItems,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Removes all items from the user's shopping cart.
 * @route DELETE /api/cart
 * @access Private
 */
export const clearCart = async (req, res, next) => {
    try {
        await CartItem.deleteMany({ user: req.user._id });

        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) {
        next(error);
    }
};
