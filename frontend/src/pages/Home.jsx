import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="flex-grow">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-primary-900/10 dark:to-indigo-900/10 -z-10" />

                <div className="container mx-auto max-w-6xl">
                    <div className="text-center space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wide uppercase">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            v2.0 Now Live
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-600 to-indigo-600 dark:from-white dark:via-primary-400 dark:to-indigo-400">
                                Discover Digital Art
                            </span>
                            <br />
                            <span className="text-gray-700 dark:text-gray-300">
                                Like Never Before
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of creators and collectors in the world's most vibrant digital art marketplace.
                            {isAuthenticated && ` Welcome back, ${user.name}!`}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/explore"
                                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Explore Artworks
                                    </Link>
                                    <Link
                                        to="/create"
                                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Create New
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        to="/explore"
                                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Browse Gallery
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
                            <div>
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">50K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Artworks</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">10K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Artists</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">100K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Collectors</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">$5M+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Volume</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white dark:bg-gray-900">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                            Why Choose PixPulse?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Everything you need to create, share, and sell digital art
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass rounded-2xl p-8 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                Premium Gallery
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Showcase your work in a beautiful, customizable gallery that makes your art shine.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass rounded-2xl p-8 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                Vibrant Community
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Connect with fellow artists, get feedback, and grow together in our supportive community.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass rounded-2xl p-8 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                Sell Your Art
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Turn your passion into profit with our integrated marketplace and secure payment system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="py-20 px-6 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-600">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Join PixPulse today and become part of the creative revolution
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
