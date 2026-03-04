/**
 * @file app.js
 * @description Main Express application configuration. Sets up middleware, routes, and error handling.
 */

import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import artworkRoutes from "./routes/artworkRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sketchRoutes from "./routes/sketchRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express application
const app = express();

/* ==========================================================================
   CORS CONFIGURATION
   Allows the frontend to communicate with the backend from specific origins.
   ========================================================================== */
const allowedOrigins = [
  "http://localhost:5173", // React (Vite) - Primary development port
  "http://localhost:5174", // React (Vite) - Backup development port
  "http://localhost:3000", // React (CRA)
  process.env.CLIENT_URL   // Production frontend URL from environment variables
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

/* ==========================================================================
   STATIC FILE SERVING
   Exposes the 'uploads' directory so that images/files can be accessed via URL.
   ========================================================================== */
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

/* ==========================================================================
   BODY PARSER MIDDLEWARE
   Enables the application to parse JSON and URL-encoded data in request bodies.
   ========================================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   BASE TEST ROUTE
   A simple route to check if the API is up and running.
   ========================================================================== */
app.get("/", (req, res) => {
  res.send("🚀 PixPulse API running");
});

/* ==========================================================================
   API ROUTES
   Defines the various endpoints available in the application.
   ========================================================================== */
// User authentication (Register, Login, Password Reset)
app.use("/api/auth", authRoutes);

// Artwork management (Upload, Fetch, Edit, Delete)
app.use("/api/artworks", artworkRoutes);

// Favorite artworks for users
app.use("/api/favorites", favoriteRoutes);

// Shopping cart functionality
app.use("/api/cart", cartRoutes);

// Checkout and Order processing
app.use("/api/checkout", checkoutRoutes);

// Downloading purchased artworks
app.use("/api/download", downloadRoutes);

// Reporting problematic or copyright-infringing content
app.use("/api/reports", reportRoutes);

// User management and public profiles
app.use("/api/users", userRoutes);

// Admin Dashboard routes (Statistics)
app.use("/api", adminRoutes);

// Sketch recognition (Draw to Search)
app.use("/api/sketch", sketchRoutes);

// Wallet system (Balance, Deposits, Purchases)
app.use("/api/wallet", walletRoutes);

// Community comments
app.use("/api/comments", commentRoutes);

/* ==========================================================================
   ERROR HANDLING MIDDLEWARE
   Catches 404 errors and handles all other exceptions globally.
   ========================================================================== */
// Handle 404 Not Found errors
app.use(notFound);

// Global error handler for custom and internal errors
app.use(errorHandler);

export default app;
