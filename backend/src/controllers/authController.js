import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
