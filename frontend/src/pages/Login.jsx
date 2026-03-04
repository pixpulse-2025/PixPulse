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
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        clearError();
        setFormData({ email: "", password: "" });
    }, [clearError]);

    useEffect(() => {
        if (isAuthenticated && user) {
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
        <div className="min-h-screen flex items-center justify-center bg-[#0B0D10] px-4 py-32 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#8B5CF6]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#6D28D9]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#A78BFA]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <div className="w-full max-w-[440px] space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Welcome back
                    </h2>
                    <p className="mt-3 text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#141821]/60 border border-white/[0.06] rounded-3xl p-7 sm:p-8 space-y-5 backdrop-blur-sm shadow-2xl shadow-black/20">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl text-sm">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="email"
                                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-white/10 bg-[#0B0D10]/80 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/50 outline-none transition-all duration-200"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-14 py-3.5 rounded-xl border border-white/10 bg-[#0B0D10]/80 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/50 outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors select-none p-0.5"
                                    aria-label="Hold to show password"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPassword ? (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </>
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2.5">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 bg-[#0B0D10] border-white/20 rounded cursor-pointer accent-[#8B5CF6]"
                                />
                                <label htmlFor="remember-me" className="text-sm text-gray-400 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>

                        {/* OR Divider */}
                        <div className="relative py-1">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.06]"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-[#141821]/60 text-xs font-semibold uppercase tracking-widest text-gray-500 backdrop-blur-sm">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <GoogleLoginButton />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
                            >
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
