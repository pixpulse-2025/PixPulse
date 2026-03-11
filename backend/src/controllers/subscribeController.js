import { sendSubscriptionEmail } from "../utils/emailService.js";

// @desc    Subscribe to newsletter
// @route   POST /api/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Send subscription welcome email
        await sendSubscriptionEmail(email);

        res.status(200).json({
            success: true,
            message: "Successfully subscribed to newsletter"
        });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process subscription"
        });
    }
};
