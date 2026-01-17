import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, loading, error, clearError } = useAuth();
    const registerSuccess = useSelector((state) => state.auth.registerSuccess);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [validationError, setValidationError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Clear errors and form data when component mounts
        clearError();
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setValidationError("");
    }, [clearError]);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Redirect to login after successful registration
        if (registerSuccess) {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [registerSuccess, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setValidationError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            setValidationError("Name is required");
            return;
        }

        if (formData.name.length < 2) {
            setValidationError("Name must be at least 2 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError("Please enter a valid email address");
            return;
        }

        if (formData.password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return;
        }

        if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
            setValidationError("Password must contain both letters and numbers");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        const termsCheckbox = document.getElementById("terms");
        if (termsCheckbox && !termsCheckbox.checked) {
            setValidationError("You must agree to the Terms and Conditions");
            return;
        }

        const { confirmPassword, ...registerData } = formData;
        await register(registerData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-32">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
                        Create your account and start your creative journey
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-6 shadow-sm">
                        {/* Success Message */}
                        {registerSuccess && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
                                Registration successful! Redirecting to login...
                            </div>
                        )}

                        {/* Error Message */}
                        {(error || validationError) && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error || validationError}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-[10px] font-black uppercase tracking-widest text-text/40 mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-black uppercase tracking-widest text-text/40 mb-2"
                            >
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
                                className="block text-[10px] font-black uppercase tracking-widest text-text/40 mb-2"
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
                                    autoComplete="new-password"
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/20 hover:text-text transition-colors select-none"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-[10px] font-black uppercase tracking-widest text-text/40 mb-2"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowConfirmPassword(true)}
                                    onMouseUp={() => setShowConfirmPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/20 hover:text-text transition-colors select-none"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-1 bg-background border-text/10 rounded cursor-pointer accent-text"
                            />
                            <label
                                htmlFor="terms"
                                className="ml-2 block text-[10px] font-black uppercase tracking-widest text-text/40 leading-relaxed"
                            >
                                I agree to the{" "}
                                <Link to="/terms" className="text-text border-b border-text/10 hover:border-text">
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-text border-b border-text/10 hover:border-text">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || registerSuccess}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
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

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text/40">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="ml-2 text-text border-b border-text/10 hover:border-text transition-all"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
