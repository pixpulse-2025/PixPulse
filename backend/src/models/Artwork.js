/**
 * @file Artwork.js
 * @description Mongoose model for Artworks. Stores information about creative assets uploaded by artists.
 */

import mongoose from "mongoose";

/**
 * Artwork Schema definition.
 * Covers metadata (title, description), classification (category, subCategory),
 * licensing/pricing (priceType, price, licenseType), and file management (fileUrl, previewUrl).
 */
const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
            enum: [
                "Visual Art",
                "Audio",
                "Video/Animation",
                "Presets/Resources",
                "Other Creative Assets",
            ],
        },
        subCategory: {
            type: String,
        },
        priceType: {
            type: String,
            required: true,
            enum: ["Free", "Paid"],
            default: "Free",
        },
        price: {
            type: Number,
            default: 0,
            validate: {
                // custom validator to ensure paid artworks have a price > 0
                validator: function (val) {
                    if (this.priceType === "Paid" && val <= 0) return false;
                    return true;
                },
                message: "Paid artwork must have a price greater than 0",
            },
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        licenseType: {
            type: String,
            required: true,
            enum: ["Personal", "Commercial"],
            default: "Personal",
        },
        fileUrl: {
            type: String,
            required: [true, "Please upload a file"],
        },
        previewUrl: {
            type: String,
        },
        fileFormat: {
            type: String,
        },
        fileSize: {
            type: Number, // Stores size in bytes
        },
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        viewedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        downloads: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Automatically track creation and update times
    }
);

/**
 * Define a text index on title, description, and tags.
 * This enables full-text search capability across these fields.
 */
artworkSchema.index({ title: "text", description: "text", tags: "text" });

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;
