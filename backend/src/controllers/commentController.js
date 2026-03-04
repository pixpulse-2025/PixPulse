/**
 * @file commentController.js
 * @description Controller for community comments: CRUD + like/unlike.
 */

import Comment from "../models/Comment.js";

/**
 * Get all comments (public feed)
 * GET /api/comments?page=1&limit=20
 */
export const getComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find()
                .populate("user", "name avatar")
                .populate("likes", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Comment.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
};

/**
 * Create a comment
 * POST /api/comments
 */
export const createComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const comment = await Comment.create({
            user: req.user._id,
            text: text.trim(),
        });

        const populated = await Comment.findById(comment._id).populate("user", "name avatar");

        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: "Failed to create comment" });
    }
};

/**
 * Delete a comment (owner or admin)
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Only the comment owner or an admin can delete
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ success: false, message: "Failed to delete comment" });
    }
};

/**
 * Like / unlike a comment
 * PATCH /api/comments/:id/like
 */
export const toggleLikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const userId = req.user._id.toString();
        const alreadyLiked = comment.likes.some((id) => id.toString() === userId);

        if (alreadyLiked) {
            comment.likes = comment.likes.filter((id) => id.toString() !== userId);
        } else {
            comment.likes.push(req.user._id);
        }

        await comment.save();

        const populated = await Comment.findById(comment._id)
            .populate("user", "name avatar")
            .populate("likes", "name");

        res.status(200).json({ success: true, data: populated });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Failed to toggle like" });
    }
};
