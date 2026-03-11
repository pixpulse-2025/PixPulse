/**
 * @file CartItem.js
 * @description Mongoose model for Shopping Cart Items. Represents an artwork a user intends to purchase.
 */

import mongoose from "mongoose";

/**
 * CartItem Schema definition.
 * Links a user to an artwork with a specific price and license type.
 */
const cartItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        licenseType: {
            type: String,
            required: true,
            enum: ["Personal", "Commercial"],
            default: "Personal",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Composite unique index.
 * Prevents the same user from adding the exact same artwork with the same license to their cart multiple times.
 */
cartItemSchema.index({ user: 1, artwork: 1, licenseType: 1 }, { unique: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
