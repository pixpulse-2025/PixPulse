import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>',
        to: email,
        subject: 'Password Reset Request - PixPulse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3B82F6; margin: 0;">PixPulse</h1>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 10px; padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        You requested to reset your password for your PixPulse account.
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Click the button below to reset your password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); 
                                  color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; font-size: 14px;">
                        Or copy and paste this link into your browser:
                    </p>
                    
                    <p style="color: #3B82F6; word-break: break-all; background: white; padding: 10px; border-radius: 5px; font-size: 12px;">
                        ${resetUrl}
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #999; font-size: 13px; margin: 5px 0;">
                            ⏰ This link will expire in <strong>1 hour</strong>.
                        </p>
                        <p style="color: #999; font-size: 13px; margin: 5px 0;">
                            🔒 If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #999; font-size: 12px;">
                        This is an automated email from PixPulse. Please do not reply.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
    // Check if credentials are still placeholders
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com' ||
        !process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your-app-password') {
        console.warn('⚠️  Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD in your .env file to enable password resets.');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✅ Email service is ready');
        return true;
    } catch (error) {
        if (error.code === 'EAUTH') {
            console.error('❌ Email service authentication failed: Please check your EMAIL_USER and EMAIL_PASSWORD (use an App Password for Gmail).');
        } else {
            console.error('❌ Email service error:', error.message);
        }
        return false;
    }
};
