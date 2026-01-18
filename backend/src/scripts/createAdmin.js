/**
 * Script to create an admin user in the database
 * Run this with: node src/scripts/createAdmin.js
 */

import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@pixpulse.com" });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("Email:", existingAdmin.email);
            console.log("Role:", existingAdmin.role);

            // Update to admin if not already
            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();
                console.log("✅ Updated existing user to admin role");
            }
        } else {
            // Create new admin user
            const adminUser = await User.create({
                name: "Admin User",
                email: "admin@pixpulse.com",
                password: "admin123",
                role: "admin",
                isVerified: true
            });

            console.log("✅ Admin user created successfully!");
            console.log("Email: admin@pixpulse.com");
            console.log("Password: admin123");
            console.log("Role:", adminUser.role);
        }

        // Also create a test regular user for demonstration
        const testUser = await User.findOne({ email: "user@pixpulse.com" });

        if (!testUser) {
            await User.create({
                name: "Test User",
                email: "user@pixpulse.com",
                password: "user123",
                role: "user",
                isVerified: true
            });
            console.log("✅ Test user created successfully!");
            console.log("Email: user@pixpulse.com");
            console.log("Password: user123");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createAdminUser();
