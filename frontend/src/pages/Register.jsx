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
            // Clear form data
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            // Clear terms checkbox
            const termsCheckbox = document.getElementById("terms");
            if (termsCheckbox) {
                termsCheckbox.checked = false;
            }

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        Join PixPulse
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Create your account and start your creative journey
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="glass rounded-2xl p-8 space-y-6">
                        {/* Success Message */}
                        {registerSuccess && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                                Registration successful! Redirecting to login...
                            </div>
                        )}

                        {/* Error Message */}
                        {(error || validationError) && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error || validationError}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
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
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    onTouchStart={() => setShowPassword(true)}
                                    onTouchEnd={() => setShowPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors select-none"
                                    aria-label="Hold to show password"
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
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowConfirmPassword(true)}
                                    onMouseUp={() => setShowConfirmPassword(false)}
                                    onMouseLeave={() => setShowConfirmPassword(false)}
                                    onTouchStart={() => setShowConfirmPassword(true)}
                                    onTouchEnd={() => setShowConfirmPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors select-none"
                                    aria-label="Hold to show password"
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
                                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="terms"
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                                I agree to the{" "}
                                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || registerSuccess}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
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
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <GoogleLoginButton />
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-500"
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
