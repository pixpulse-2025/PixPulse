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
 * Get public profile of a user (including their uploaded artworks)
 * GET /api/users/profile/:id
 * Public
 */
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name avatar bio email role createdAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const artworks = await Artwork.find({ artist: req.params.id, status: "published" }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                user,
                artworks
            }
        });
    } catch (error) {
        console.error("Error fetching public profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch public profile"
        });
    }
};
