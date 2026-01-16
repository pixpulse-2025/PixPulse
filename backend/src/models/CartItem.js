import mongoose from "mongoose";

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
            enum: ["Personal", "Commercial", "Extended Commercial"],
            default: "Personal",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate items in cart (same user + same artwork + same license)
cartItemSchema.index({ user: 1, artwork: 1, licenseType: 1 }, { unique: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
