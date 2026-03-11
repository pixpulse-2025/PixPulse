import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
            required: true,
        },
        buyerName: {
            type: String,
            required: true,
        },
        buyerEmail: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        orderIdString: {
            type: String,
            required: true,
        },
        licenseId: {
            type: String,
            required: true,
            unique: true,
        },
        licenseKey: {
            type: String,
            required: true,
            unique: true,
        },
        licenseType: {
            type: String,
            enum: ["Personal", "Commercial"],
            default: "Personal",
        },
        platformName: {
            type: String,
            default: "PixPulse",
        },
    },
    {
        timestamps: true,
    }
);

licenseSchema.pre("validate", async function () {
    if (!this.licenseId) {
        this.licenseId = `LIC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    if (!this.licenseKey) {
        this.licenseKey = `KEY-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    }
});

const License = mongoose.model("License", licenseSchema);

export default License;
