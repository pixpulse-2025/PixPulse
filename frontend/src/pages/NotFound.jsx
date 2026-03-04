import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex-grow flex items-center justify-center px-6 py-20">
            <div className="text-center max-w-2xl">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-indigo-600">
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#8B5CF6]/10">
                        <svg
                            className="w-12 h-12 text-[#8B5CF6]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Page Not Found
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn-primary px-8 py-4 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/explore"
                        className="btn-secondary px-8 py-4 rounded-xl font-semibold transition-all"
                    >
                        Browse Artworks
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-sm text-gray-400 mb-4">
                        Here are some helpful links instead:
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/community"
                            className="text-[#8B5CF6] hover:underline"
                        >
                            Community
                        </Link>
                        <Link
                            to="/login"
                            className="text-[#8B5CF6] hover:underline"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-[#8B5CF6] hover:underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
