/**
 * @file walletController.js
 * @description Handles wallet operations — balance, deposits, and wallet-based purchases.
 */

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import Artwork from "../models/Artwork.js";

/**
 * GET /api/wallet/balance
 * Returns the current wallet balance and recent transactions.
 */
export const getWalletBalance = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        const transactions = await Transaction.find({ user: req.user._id })
            .sort("-createdAt")
            .limit(20)
            .populate("artwork", "title previewUrl");

        res.status(200).json({
            success: true,
            data: {
                balance: user.walletBalance || 0,
                transactions,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/wallet/deposit
 * Add test money to the wallet.
 */
export const depositFunds = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid amount",
            });
        }

        if (amount > 10000) {
            return res.status(400).json({
                success: false,
                message: "Maximum deposit is $10,000",
            });
        }

        const user = await User.findById(req.user._id);
        const previousBalance = user.walletBalance || 0;
        user.walletBalance = previousBalance + amount;
        await user.save();

        // Record the transaction
        const transaction = await Transaction.create({
            user: req.user._id,
            type: "deposit",
            amount: amount,
            balanceAfter: user.walletBalance,
            description: `Added $${amount.toFixed(2)} to wallet`,
            status: "completed",
        });

        res.status(200).json({
            success: true,
            data: {
                balance: user.walletBalance,
                transaction,
            },
            message: `$${amount.toFixed(2)} added to your wallet`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/wallet/purchase
 * Pay for cart items using wallet balance.
 * Creates an order, deducts from wallet, credits artist, clears cart.
 */
export const purchaseWithWallet = async (req, res, next) => {
    try {
        // Get user's cart with artwork details
        const cartItems = await CartItem.find({ user: req.user._id }).populate("artwork");

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        // Calculate total and build order items
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
                fileUrl: artwork.fileUrl || "",
                previewUrl: artwork.previewUrl || "",
            });
        }

        // Check wallet balance
        const user = await User.findById(req.user._id);
        if ((user.walletBalance || 0) < totalAmount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient wallet balance. You need $${totalAmount.toFixed(2)} but have $${(user.walletBalance || 0).toFixed(2)}`,
            });
        }

        // Step 1: Create the order FIRST (before deducting wallet)
        // This prevents money being deducted if order creation fails
        let order;
        try {
            order = await Order.create({
                user: req.user._id,
                items: orderItems,
                totalAmount,
                paymentMethod: "wallet",
                billingDetails: {
                    email: req.user.email,
                    name: req.user.name,
                },
                paymentStatus: "completed",
                status: "completed",
                transactionId: `WLT-${Date.now().toString(36).toUpperCase()}`,
                downloadLinks: orderItems.map((item) => ({
                    artwork: item.artwork,
                    url: item.fileUrl,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                })),
            });
        } catch (orderError) {
            console.error("❌ Order creation failed:", orderError);
            return res.status(500).json({
                success: false,
                message: "Failed to create order: " + orderError.message,
            });
        }

        // Step 2: Deduct from wallet (order exists now, safe)
        user.walletBalance -= totalAmount;
        await user.save();

        // Step 3: Record purchase transactions and distribute revenue (90% artist, 10% admin)
        // Find admin user(s) to credit commission
        const adminUsers = await User.find({ role: "admin" });
        const primaryAdmin = adminUsers.length > 0 ? adminUsers[0] : null;

        for (const cartItem of cartItems) {
            const artwork = cartItem.artwork;
            const itemPrice = cartItem.price;
            const artistShare = Math.round(itemPrice * 0.90 * 100) / 100; // 90% to artist
            const adminShare = Math.round(itemPrice * 0.10 * 100) / 100;  // 10% to admin

            const revenueBreakdown = {
                originalPrice: itemPrice,
                artistShare,
                adminShare,
            };

            // 3a: Record buyer's purchase transaction
            try {
                await Transaction.create({
                    user: req.user._id,
                    type: "purchase",
                    amount: -itemPrice,
                    balanceAfter: user.walletBalance,
                    description: `Purchased "${artwork.title}"`,
                    order: order._id,
                    artwork: artwork._id,
                    revenueBreakdown,
                    status: "completed",
                });
            } catch (txErr) {
                console.error("⚠️ Purchase transaction record failed:", txErr.message);
            }

            // 3b: Credit artist (90%) and record earning transaction
            const artistId = artwork.artist;
            if (artistId) {
                try {
                    const updatedArtist = await User.findByIdAndUpdate(
                        artistId,
                        { $inc: { walletBalance: artistShare } },
                        { new: true }
                    );
                    await Transaction.create({
                        user: artistId,
                        type: "earning",
                        amount: artistShare,
                        balanceAfter: updatedArtist?.walletBalance || 0,
                        description: `Earned 90% from sale of "${artwork.title}" ($${itemPrice.toFixed(2)})`,
                        artwork: artwork._id,
                        order: order._id,
                        revenueBreakdown,
                        relatedUser: req.user._id,
                        status: "completed",
                    });
                } catch (earnErr) {
                    console.error("⚠️ Artist earning failed:", earnErr.message);
                }
            }

            // 3c: Credit admin (10%) and record commission transaction
            if (primaryAdmin) {
                try {
                    const updatedAdmin = await User.findByIdAndUpdate(
                        primaryAdmin._id,
                        { $inc: { walletBalance: adminShare } },
                        { new: true }
                    );
                    await Transaction.create({
                        user: primaryAdmin._id,
                        type: "admin_commission",
                        amount: adminShare,
                        balanceAfter: updatedAdmin?.walletBalance || 0,
                        description: `10% commission from sale of "${artwork.title}" by ${artwork.artist ? 'artist' : 'unknown'}`,
                        artwork: artwork._id,
                        order: order._id,
                        revenueBreakdown,
                        relatedUser: artistId || null,
                        status: "completed",
                    });
                } catch (commErr) {
                    console.error("⚠️ Admin commission record failed:", commErr.message);
                }
            }
        }

        // Step 4: Update artwork download counts
        for (const item of orderItems) {
            await Artwork.findByIdAndUpdate(item.artwork, {
                $inc: { downloads: 1 },
            }).catch(() => { });
        }

        // Step 5: Clear user's cart
        await CartItem.deleteMany({ user: req.user._id });

        // Populate and return order with artist details
        await order.populate({
            path: "items.artwork",
            populate: { path: "artist", select: "name avatar" },
        });

        res.status(200).json({
            success: true,
            data: {
                order,
                newBalance: user.walletBalance,
            },
            message: "Purchase successful!",
        });
    } catch (error) {
        console.error("❌ purchaseWithWallet error:", error);
        next(error);
    }
};

/**
 * GET /api/wallet/transactions
 * Get full transaction history with pagination.
 */
export const getTransactions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Transaction.countDocuments({ user: req.user._id });
        const transactions = await Transaction.find({ user: req.user._id })
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)
            .populate("artwork", "title previewUrl")
            .populate("order", "orderNumber");

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};
