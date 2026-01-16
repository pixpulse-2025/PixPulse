import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex-grow flex items-center justify-center px-6 py-20">
            <div className="text-center max-w-2xl">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30">
                        <svg
                            className="w-12 h-12 text-primary-600 dark:text-primary-400"
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
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    Page Not Found
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/explore"
                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        Browse Artworks
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Here are some helpful links instead:
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/community"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Community
                        </Link>
                        <Link
                            to="/login"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
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
