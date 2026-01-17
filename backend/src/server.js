/**
 * @file server.js
 * @description Entry point for the backend application. Initializes the database connection,
 * verifies configuration, and starts the Express server.
 */

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { verifyEmailConfig } from "./utils/emailService.js";

// Connect to MongoDB using the configuration defined in config/db.js
await connectDB();

const PORT = process.env.PORT || 5000;

/**
 * Start the Express server and listen on the specified port.
 * After starting, it also verifies the email service configuration.
 */
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Verify that the email service (Nodemailer) is correctly configured for sending emails
  await verifyEmailConfig();
});
