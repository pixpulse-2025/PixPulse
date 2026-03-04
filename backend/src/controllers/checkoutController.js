import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import Artwork from "../models/Artwork.js";

/**
 * Creates a new order based on the user's current shopping cart.
 * Transitions items from CartItem to Order records and prepares for payment.
 * @route POST /api/checkout
 * @access Private
 */
export const createOrder = async (req, res, next) => {
    try {
        const { billingDetails, paymentMethod } = req.body;

        // Get user's cart
        const cartItems = await CartItem.find({ user: req.user._id }).populate("artwork");

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        // Calculate total and prepare order items
        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of cartItems) {
            const artwork = cartItem.artwork;

            if (!artwork) {
                return res.status(404).json({
                    success: false,
                    message: "One or more artworks not found",
                });
            }

            totalAmount += cartItem.price;

            orderItems.push({
                artwork: artwork._id,
                title: artwork.title,
                price: cartItem.price,
                licenseType: cartItem.licenseType,
                fileUrl: artwork.fileUrl,
                previewUrl: artwork.previewUrl,
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            paymentMethod,
            billingDetails: billingDetails || {
                email: req.user.email,
                name: req.user.name,
            },
            paymentStatus: "pending",
            status: "processing",
        });

        // TODO: Integrate with payment gateway (Stripe/PayPal)
        // For now, we'll simulate a successful payment
        // In production, you would:
        // 1. Create payment intent with Stripe
        // 2. Return client secret to frontend
        // 3. Frontend confirms payment
        // 4. Webhook updates order status

        res.status(201).json({
            success: true,
            data: order,
            message: "Order created successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Finalizes an order after a successful payment has been processed.
 * Generates download links, increments download counts, and clears the cart.
 * @route POST /api/checkout/complete/:orderId
 * @access Private
 */
export const completeOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { paymentIntentId, transactionId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Verify ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Update order status
        order.paymentStatus = "completed";
        order.status = "completed";
        order.paymentIntentId = paymentIntentId;
        order.transactionId = transactionId;

        // Generate download links (valid for 7 days)
        const downloadLinks = order.items.map((item) => ({
            artwork: item.artwork,
            url: item.fileUrl,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }));

        order.downloadLinks = downloadLinks;
        await order.save();

        // Update artwork download count
        for (const item of order.items) {
            await Artwork.findByIdAndUpdate(item.artwork, {
                $inc: { downloads: 1 },
            });
        }

        // Clear user's cart
        await CartItem.deleteMany({ user: req.user._id });

        // Populate order data
        await order.populate("items.artwork");

        res.status(200).json({
            success: true,
            data: order,
            message: "Order completed successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves a list of all orders placed by the currently authenticated user.
 * @route GET /api/checkout/orders
 * @access Private
 */
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: "items.artwork",
                populate: { path: "artist", select: "name avatar" }
            })
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves the details of a specific order by its unique ID.
 * @route GET /api/checkout/orders/:orderId
 * @access Private
 */
export const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate({
            path: "items.artwork",
            populate: { path: "artist", select: "name avatar" }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Verify ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancels a pending order before completion.
 * @route PATCH /api/checkout/orders/:orderId/cancel
 * @access Private
 */
export const cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Verify ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Only pending orders can be cancelled
        if (order.paymentStatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be cancelled",
            });
        }

        order.status = "cancelled";
        order.paymentStatus = "failed";
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: "Order cancelled successfully",
        });
    } catch (error) {
        next(error);
    }
};
