# Google OAuth & Forgot Password Implementation Guide

## 🚀 Implementation Plan

This guide covers implementing:
1. **Google OAuth** for login and registration
2. **Forgot Password** functionality with email reset

---

## 📦 Required Packages

### Backend Dependencies
```bash
cd backend
npm install passport passport-google-oauth20 nodemailer
```

### Frontend Dependencies
```bash
cd frontend
npm install @react-oauth/google
```

---

## 🔧 Backend Implementation

### 1. Environment Variables

Add to `backend/.env`:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=PixPulse <noreply@pixpulse.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 2. Update User Model

Add to `backend/src/models/User.js`:
```javascript
// Add these fields to the schema
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
```

### 3. Create Email Service

Create `backend/src/utils/emailService.js`:
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request - PixPulse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3B82F6;">Password Reset Request</h2>
                <p>You requested to reset your password for your PixPulse account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; 
                          color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px;">
                    This is an automated email from PixPulse. Please do not reply.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
```

### 4. Update Auth Controller

Add to `backend/src/controllers/authController.js`:
```javascript
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with that email',
            });
        }

        // Check if user registered with Google
        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'This account uses Google Sign-In. Please login with Google.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token and set to user
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        
        await user.save();

        // Send email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash token to compare
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Google OAuth Callback
export const googleAuth = async (req, res) => {
    try {
        const { googleId, email, name, picture } = req.body;

        // Check if user exists
        let user = await User.findOne({ 
            $or: [{ email }, { googleId }] 
        });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                avatar: picture,
                isVerified: true, // Google emails are verified
                password: crypto.randomBytes(32).toString('hex'), // Random password
            });
        } else if (!user.googleId) {
            // Link Google account to existing email account
            user.googleId = googleId;
            user.authProvider = 'google';
            user.avatar = picture || user.avatar;
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
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
```

### 5. Update Auth Routes

Add to `backend/src/routes/authRoutes.js`:
```javascript
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google', googleAuth);
```

---

## 🎨 Frontend Implementation

### 1. Setup Google OAuth

Create `frontend/src/config/google.js`:
```javascript
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    'your_google_client_id.apps.googleusercontent.com';
```

Add to `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Update Main.jsx

Wrap app with GoogleOAuthProvider:
```javascript
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Provider store={store}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

### 3. Create Google Login Button Component

Create `frontend/src/components/GoogleLoginButton.jsx`:
```javascript
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const GoogleLoginButton = () => {
    const { loginWithGoogle } = useAuth();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                // Send to backend
                await loginWithGoogle({
                    googleId: userInfo.data.sub,
                    email: userInfo.data.email,
                    name: userInfo.data.name,
                    picture: userInfo.data.picture,
                });
            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        onError: () => {
            console.error('Google login failed');
        },
    });

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 border-2 border-gray-200 dark:border-gray-700 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                       transition-all flex items-center justify-center gap-3 
                       text-gray-700 dark:text-gray-300 font-medium"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            Continue with Google
        </button>
    );
};

export default GoogleLoginButton;
```

### 4. Create Forgot Password Page

Create `frontend/src/pages/ForgotPassword.jsx`:
```javascript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { data } = await axios.post(`${API_URL}/auth/forgot-password`, {
                email,
            });

            setMessage(data.message);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="glass rounded-2xl p-8 space-y-6">
                        {message && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
```

### 5. Create Reset Password Page

Create `frontend/src/pages/ResetPassword.jsx`:
```javascript
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_URL}/auth/reset-password/${token}`, {
                password: formData.password,
            });

            alert('Password reset successful! Please login with your new password.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Enter your new password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="glass rounded-2xl p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Password fields with hold-to-peek */}
                        {/* Similar to Login/Register pages */}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
```

---

## 📝 Next Steps

1. **Get Google OAuth Credentials:**
   - Go to Google Cloud Console
   - Create new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Setup Email Service:**
   - Use Gmail with App Password
   - Or use SendGrid, Mailgun, etc.

3. **Update Environment Variables**

4. **Add Routes to App.jsx**

5. **Test All Flows**

This is a comprehensive guide. Would you like me to implement the actual code files now?
