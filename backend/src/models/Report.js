import mongoose from "mongoose";

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
            ref: "User",
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
reportSchema.index({ artwork: 1, reporter: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

// Prevent duplicate reports from same user for same artwork
reportSchema.index({ artwork: 1, reporter: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;
