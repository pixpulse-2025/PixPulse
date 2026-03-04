/**
 * @file Comment.js
 * @description Mongoose model for public community comments.
 */

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
