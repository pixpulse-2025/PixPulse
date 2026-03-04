import User from "../models/User.js";
import Artwork from "../models/Artwork.js";

/**
 * Get top creators based on artwork views
 * GET /api/users/top-creators
 * Public
 */
export const getTopCreators = async (req, res) => {
    try {
        const topArtists = await Artwork.aggregate([
            {
                $group: {
                    _id: "$artist",
                    totalViews: { $sum: "$views" },
                    totalArtworks: { $sum: 1 }
                }
            },
            { $sort: { totalViews: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "artist"
                }
            },
            { $unwind: "$artist" },
            {
                $project: {
                    _id: 1,
                    totalViews: 1,
                    totalArtworks: 1,
                    name: "$artist.name",
                    avatar: "$artist.avatar",
                    role: "$artist.role",  // Should be 'artist' usually, strictly speaking everyone can upload?
                    email: "$artist.email"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: topArtists
        });
    } catch (error) {
        console.error("Error fetching top creators:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top creators"
        });
    }
};

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
 * Get user by ID (Admin only or Public Profile?)
 * Currently restricted to Admin in adminController, but for profiles we might want public.
 * Stick to Admin for now to match previous behavior, or allow public if needed.
 * But wait, getUserById is generic.
 * Providing limited public info is better for profiles.
 * For now, I'll keep it as "Admin Only" for this specific controller function to replicate admin functionality,
 * and if I need public profile, I'll add `getPublicProfile`.
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
