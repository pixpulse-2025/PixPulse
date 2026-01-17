/**
 * @file Favorite.js
 * @description Mongoose model for User Favorites. Tracks which artworks users have bookmarked.
 */

import mongoose from "mongoose";

/**
 * Favorite Schema definition.
 * Simple reference model connecting a user to an artwork.
 */
const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Unique index on user and artwork.
 * Ensures a user cannot favorite the same artwork more than once.
 */
favoriteSchema.index({ user: 1, artwork: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
