import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Redirect admins to admin dashboard
    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    // Mock data for the dashboard
    const stats = [
        { label: "Total Artworks", value: "12", trend: "+2 this month", icon: "📊" },
        { label: "Total Views", value: "1.2k", trend: "+15% growth", icon: "👁️" },
        { label: "Downloads", value: "450", trend: "+5 today", icon: "⬇️" },
        { label: "Revenue", value: "$1,240", trend: "+$240 weekly", icon: "💰" },
    ];

    const activities = [
        { id: 1, type: "liked", user: "Sarah Chen", target: "Neon Dreams", time: "2h ago" },
        { id: 2, type: "downloaded", user: "Mark Wilson", target: "Cyber Sunset", time: "5h ago" },
        { id: 3, type: "followed", user: "Alex Rivera", target: "you", time: "Yesterday" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Navigation Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        <div className="card-surface p-6 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0369a1&color=fff`}
                                    alt={user?.name}
                                    className="w-full h-full rounded-full border-4 border-gray-200 object-cover"
                                />
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-[#075985] transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user?.role || "Member"}</p>
                            <Link
                                to="/settings"
                                className="btn-secondary w-full text-sm"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Overview
                            </button>
                            <Link
                                to="/my-uploads"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                My Artworks
                            </Link>
                            <Link
                                to="/my-purchases"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                My Purchases
                            </Link>
                            <Link
                                to="/favorites"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                Favorites
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                            <p className="text-base text-gray-600 dark:text-gray-400">Welcome back, {user?.name}! Here's your account overview.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="card-surface p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                                        <span className="text-2xl">{stat.icon}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Performance Chart */}
                            <div className="lg:col-span-2 card-surface p-8">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance Overview</h3>
                                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No data available yet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Upload artworks to see your performance</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="card-surface p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    <span className="font-semibold">{activity.user}</span> {activity.type} <span className="font-semibold">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-secondary w-full mt-4 text-sm">
                                    View All Activity
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card-surface p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link to="/upload" className="btn-primary text-center">
                                    Upload New Artwork
                                </Link>
                                <Link to="/explore" className="btn-secondary text-center">
                                    Browse Marketplace
                                </Link>
                                <Link to="/settings" className="btn-secondary text-center">
                                    Account Settings
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
