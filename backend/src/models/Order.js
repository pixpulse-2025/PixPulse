import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
        required: true,
    },
    title: {
        type: String,
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
    },
    fileUrl: {
        type: String,
        required: true,
    },
    previewUrl: {
        type: String,
    },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["stripe", "paypal", "credit_card"],
        },
        paymentIntentId: {
            type: String, // Stripe payment intent ID
        },
        transactionId: {
            type: String, // Payment processor transaction ID
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        billingDetails: {
            email: String,
            name: String,
            address: {
                line1: String,
                line2: String,
                city: String,
                state: String,
                postal_code: String,
                country: String,
            },
        },
        downloadLinks: [
            {
                artwork: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Artwork",
                },
                url: String,
                expiresAt: Date,
            },
        ],
        status: {
            type: String,
            enum: ["processing", "completed", "cancelled"],
            default: "processing",
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique order number
orderSchema.pre("save", async function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
