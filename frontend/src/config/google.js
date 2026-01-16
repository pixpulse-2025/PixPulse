// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Check if Google OAuth is configured
export const isGoogleOAuthConfigured = () => {
    return GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 0;
};
