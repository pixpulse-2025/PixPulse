import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
            select: false, // Don't return password by default
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
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows null values
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
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    // Only hash if password is modified
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Method to get user without password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    return user;
};

const User = mongoose.model("User", userSchema);

export default User;
