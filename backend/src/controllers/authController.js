import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

/* ======================
   HELPER: Generate JWT Token
====================== */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

/* ======================
   @desc    Register new user
   @route   POST /api/auth/register
   @access  Public
====================== */
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error registering user",
        });
    }
};

/* ======================
   @desc    Login user
   @route   POST /api/auth/login
   @access  Public
====================== */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error logging in",
        });
    }
};

/* ======================
   @desc    Get current user
   @route   GET /api/auth/me
   @access  Private
====================== */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching user",
        });
    }
};

/* ======================
   @desc    Update user profile
   @route   PUT /api/auth/profile
   @access  Private
====================== */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating profile",
        });
    }
};

/* ======================
   @desc    Logout user (client-side token removal)
   @route   POST /api/auth/logout
   @access  Private
====================== */
export const logout = async (req, res, next) => {
    try {
        // In JWT auth, logout is typically handled client-side
        // This endpoint can be used for logging or cleanup
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error logging out",
        });
    }
};

/* ======================
   @desc    Google OAuth Login/Register
   @route   POST /api/auth/google
   @access  Public
====================== */
export const googleAuth = async (req, res) => {
    try {
        const { googleId, email, name, picture } = req.body;

        if (!googleId || !email || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing required Google auth data",
            });
        }

        // Check if user exists by email or googleId
        let user = await User.findOne({
            $or: [{ email }, { googleId }],
        });

        if (!user) {
            // Create new user with Google auth
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: "google",
                avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                isVerified: true, // Google emails are verified
                password: crypto.randomBytes(32).toString("hex"), // Random password for security
            });
        } else if (!user.googleId) {
            // Link Google account to existing email account
            user.googleId = googleId;
            user.authProvider = "google";
            if (picture) user.avatar = picture;
            user.isVerified = true;
            await user.save();
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Google authentication failed",
        });
    }
};

/* ======================
   @desc    Forgot Password
   @route   POST /api/auth/forgot-password
   @access  Public
====================== */
export const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        if (email) email = email.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with that email address",
            });
        }

        // Check if user registered with Google
        if (user.authProvider === "google") {
            return res.status(400).json({
                success: false,
                message: "This account uses Google Sign-In. Please login with Google.",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token and set to user
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        try {
            await sendPasswordResetEmail(user.email, resetToken);

            res.status(200).json({
                success: true,
                message: "Password reset email sent successfully",
            });
        } catch (emailError) {
            // If email fails, clear the reset token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            console.error("Email send error:", emailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send password reset email. Please try again later.",
            });
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error processing password reset request",
        });
    }
};

/* ======================
   @desc    Reset Password
   @route   POST /api/auth/reset-password/:token
   @access  Public
====================== */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please provide a new password",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Hash token to compare with stored hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login with your new password.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error resetting password",
        });
    }
};
