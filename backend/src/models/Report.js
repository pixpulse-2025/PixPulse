/**
 * @file Report.js
 * @description Mongoose model for Content Reports. Allows users to flag artworks for various violations.
 */

import mongoose from "mongoose";

/**
 * Report Schema definition.
 * Links a reporter (user) to a reported artwork. Includes the reason, description, and status.
 */
const reportSchema = new mongoose.Schema(
    {
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
            required: true,
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: [true, "Please provide a reason for reporting"],
            enum: [
                "Copyright Infringement",
                "Inappropriate Content",
                "Spam",
                "Misleading Information",
                "Hate Speech",
                "Violence",
                "Other",
            ],
        },
        description: {
            type: String,
            required: [true, "Please provide additional details"],
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "reviewing", "resolved", "dismissed"],
            default: "pending",
        },
        adminNotes: {
            type: String,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Admin who resolved the report
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes for optimized querying by status and date.
 */
reportSchema.index({ artwork: 1, reporter: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

/**
 * Unique index on artwork and reporter.
 * Prevents a single user from reporting the same artwork multiple times.
 */
reportSchema.index({ artwork: 1, reporter: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;
