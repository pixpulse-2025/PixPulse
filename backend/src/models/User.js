/**
 * @file User.js
 * @description Mongoose model for User. Handles user profiles, authentication data, and roles.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Schema definition.
 * Includes basic info (name, email), authentication (password, googleId), 
 * roles (user, artist, admin), and state (isVerified, isBlocked).
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Prevents password from being returned in queries by default
        },
        role: {
            type: String,
            enum: ["user", "artist", "admin"],
            default: "user",
        },
        avatar: {
            type: String,
            default: "https://ui-avatars.com/api/?name=User&background=random",
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"],
        },
        website: {
            type: String,
            maxlength: [100, "Website URL cannot exceed 100 characters"],
        },
        location: {
            type: String,
            maxlength: [100, "Location cannot exceed 100 characters"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        walletBalance: {
            type: Number,
            default: 500, // $500 test money for every new user
            min: 0,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Needed because googleId is optional but must be unique if present
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);

/**
 * Pre-save middleware (hook) to hash the password before it is saved to the database.
 * Only runs if the password field has been modified.
 */
userSchema.pre("save", async function () {
    // Skip hashing if the password has not been changed
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a plain text password with the hashed password stored in the database.
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Customizes the toJSON output for the User model.
 * Removes sensitive fields like password and reset tokens before sending data to the client.
 */
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    return user;
};

const User = mongoose.model("User", userSchema);

export default User;
