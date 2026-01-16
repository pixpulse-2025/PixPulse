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
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

/* ======================
   CORS CONFIGURATION
====================== */
const allowedOrigins = [
  "http://localhost:5173", // React (Vite)
  "http://localhost:5174", // React (Vite - Backup port)
  "http://localhost:3000", // React (CRA)
  process.env.CLIENT_URL   // Production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

/* ======================
   STATIC SERVING
====================== */
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

/* ======================
   BODY PARSER
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   BASE TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("🚀 PixPulse API running");
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/reports", reportRoutes);
// app.use("/api/admin", adminRoutes);

/* ======================
   ERROR HANDLING
====================== */
app.use(notFound);
app.use(errorHandler);

export default app;
