import User from "../models/User.js";
import Artwork from "../models/Artwork.js";
import Order from "../models/Order.js";

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

/**
 * Update user (Admin only)
 * PATCH /api/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { role, isBlocked } = req.body;
        const updateData = {};

        if (role !== undefined) updateData.role = role;
        if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: "User updated successfully"
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent deleting admin users
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete admin users"
            });
        }

        // Delete user's artworks
        await Artwork.deleteMany({ artist: req.params.id });

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Get user statistics
        const totalUsers = await User.countDocuments();
        const totalArtists = await User.countDocuments({ role: "artist" });
        const blockedUsers = await User.countDocuments({ isBlocked: true });

        // Get artwork statistics
        const totalArtworks = await Artwork.countDocuments();
        const pendingArtworks = await Artwork.countDocuments({ status: "pending" });

        // Get order statistics
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // Get recent users
        const recentUsers = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent artworks
        const recentArtworks = await Artwork.find()
            .populate("artist", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    artists: totalArtists,
                    blocked: blockedUsers
                },
                artworks: {
                    total: totalArtworks,
                    pending: pendingArtworks
                },
                orders: {
                    total: totalOrders,
                    revenue: totalRevenue[0]?.total || 0
                },
                recent: {
                    users: recentUsers,
                    artworks: recentArtworks
                }
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};
