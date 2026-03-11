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

// Send subscription welcome email
export const sendSubscriptionEmail = async (email) => {
    const adminEmail = process.env.EMAIL_FROM || 'pixpulse.team@gmail.com';

    // Email to the subscriber
    const mailToUserOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>',
        to: email,
        subject: 'Welcome to PixPulse Newsletter!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3B82F6; margin: 0;">PixPulse</h1>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 10px; padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Welcome to our Newsletter!</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for subscribing to the PixPulse newsletter. You are now part of our community of creators.
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        We'll send you weekly design resources, inspiration, and updates straight to your inbox.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); 
                                  color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Explore PixPulse
                        </a>
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

    // Email to the project team
    const mailToAdminOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>',
        to: adminEmail,
        subject: 'New Newsletter Subscriber',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; margin-top: 0;">New Subscription Alert</h2>
                <p style="color: #444; line-height: 1.6;">A new user has subscribed to the "Stay Inspired" newsletter.</p>
                <p style="color: #444; line-height: 1.6;"><strong>Email:</strong> ${email}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailToUserOptions);
        await transporter.sendMail(mailToAdminOptions);
        console.log('Subscription emails sent to:', email, 'and admin');
    } catch (error) {
        console.error('Error sending subscription email:', error);
        throw new Error('Failed to send subscription email');
    }
};

// Send contact us email
export const sendContactUsEmail = async (name, email, subject, message) => {
    const adminEmail = process.env.EMAIL_FROM || 'pixpulse.team@gmail.com';

    const mailToAdminOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>', // Use verified app email to prevent SMTP bounces
        to: adminEmail, // Receive at the app's default email address
        replyTo: email, // Reply to the user directly
        subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333; margin-top: 0;">New Contact Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
        `,
    };

    const mailToUserOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>',
        to: email, // Send explicitly to the user
        subject: 'We received your message - PixPulse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #3B82F6; margin-top: 0;">PixPulse</h2>
                <p style="color: #666; line-height: 1.6;">Hello ${name},</p>
                <p style="color: #666; line-height: 1.6;">
                    Thank you for reaching out to us. We have received your message regarding <strong>"${subject || 'your inquiry'}"</strong>.
                </p>
                <p style="color: #666; line-height: 1.6;">
                    Our team will review your message and get back to you as soon as possible.
                </p>
                <br />
                <p style="color: #999; font-size: 13px;">
                    This is an automated confirmation email. Please do not reply directly to this message.
                </p>
            </div>
        `,
    };

    try {
        // Send email to admin
        await transporter.sendMail(mailToAdminOptions);
        // Send auto-reply to user
        await transporter.sendMail(mailToUserOptions);
        console.log('Contact us emails sent for:', email);
    } catch (error) {
        console.error('Error sending contact us email:', error);
        throw new Error('Failed to send contact us email');
    }
};

// Send transaction notification email
export const sendTransactionEmail = async (email, name, transaction) => {
    const isCredit = transaction.amount > 0;
    const amountStr = `$${Math.abs(transaction.amount).toFixed(2)}`;

    // Pick subject and color based on type
    let subject = 'New Transaction - PixPulse';
    let actionText = '';
    let color = '#3B82F6'; // Default blue

    if (transaction.type === 'deposit') {
        subject = 'Deposit Successful - PixPulse';
        actionText = `You have successfully deposited ${amountStr} into your wallet.`;
        color = '#10B981'; // Green
    } else if (transaction.type === 'purchase') {
        subject = 'Purchase Receipt - PixPulse';
        actionText = `You have successfully purchased an item for ${amountStr}.`;
        color = '#8B5CF6'; // Violet
    } else if (transaction.type === 'earning') {
        subject = 'You made a sale! - PixPulse';
        actionText = `You earned ${amountStr} from a sale!`;
        color = '#F59E0B'; // Amber
    } else if (transaction.type === 'admin_commission') {
        subject = 'Admin Commission Earned - PixPulse';
        actionText = `You received a commission of ${amountStr}.`;
        color = '#06B6D4'; // Cyan
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'PixPulse <noreply@pixpulse.com>',
        to: email,
        subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: ${color}; margin: 0;">PixPulse</h1>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 10px; padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Transaction Alert</h2>
                    
                    <p style="color: #666; line-height: 1.6;">Hello ${name},</p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        ${actionText}
                    </p>
                    
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${color};">
                        <p style="margin: 5px 0; color: #555;"><strong>Transaction Type:</strong> <span style="text-transform: capitalize;">${transaction.type.replace('_', ' ')}</span></p>
                        <p style="margin: 5px 0; color: #555;"><strong>Description:</strong> ${transaction.description}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Amount:</strong> <span style="color: ${isCredit ? '#10B981' : '#EF4444'}; font-weight: bold;">${isCredit ? '+' : '-'}${amountStr}</span></p>
                        <p style="margin: 5px 0; color: #555;"><strong>New Balance:</strong> $${transaction.balanceAfter.toFixed(2)}</p>
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
        console.log('Transaction email sent to:', email);
    } catch (error) {
        console.error('Error sending transaction email:', error);
        // We do not throw error here to avoid blocking the main transaction flow
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
