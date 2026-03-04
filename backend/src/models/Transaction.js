/**
 * @file Transaction.js
 * @description Mongoose model for wallet transactions. Tracks all money movements.
 */

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["deposit", "purchase", "refund", "earning", "admin_commission"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        balanceAfter: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        // Reference to order if it's a purchase
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        // Reference to artwork if applicable
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
        },
        // Reference to the related user (e.g., the artist for an admin_commission)
        relatedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Revenue breakdown for purchase/earning/admin_commission transactions
        revenueBreakdown: {
            originalPrice: { type: Number },
            artistShare: { type: Number },   // 90%
            adminShare: { type: Number },     // 10%
        },
        status: {
            type: String,
            enum: ["completed", "pending", "failed"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
