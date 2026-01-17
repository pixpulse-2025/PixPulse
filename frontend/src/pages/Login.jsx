import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user, loading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Clear errors and form data when component mounts
        clearError();
        setFormData({
            email: "",
            password: "",
        });
    }, [clearError]);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated && user) {
            // Check if user is admin and redirect to admin dashboard
            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                const from = location.state?.from?.pathname || "/dashboard";
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-32">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-6 shadow-sm">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/20 hover:text-text transition-colors select-none"
                                    aria-label="Hold to show password"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 bg-background border-text/10 rounded cursor-pointer accent-text"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-[10px] font-black uppercase tracking-widest text-text/40"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-[10px] font-black uppercase tracking-widest text-text hover:opacity-60 transition-all border-b border-transparent hover:border-text"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* OR Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-text/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px]">
                                <span className="px-4 bg-background text-text/20 font-black uppercase tracking-widest">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <GoogleLoginButton />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text/40">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="ml-2 text-text border-b border-text/10 hover:border-text transition-all"
                            >
                                Register for free
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
