import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    // Mock data for the dashboard
    const stats = [
        { label: "Total Artworks", value: "12", icon: "🎨", trend: "+2 this month" },
        { label: "Total Views", value: "1.2k", icon: "👁️", trend: "+15% from last week" },
        { label: "Downloads", value: "450", icon: "📥", trend: "+5 today" },
        { label: "Revenue", value: "$1,240", icon: "💰", trend: "+$240 this week" },
    ];

    const recentArtworks = [
        { id: 1, title: "Neon Dreams", views: 245, likes: 45, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=300&fit=crop" },
        { id: 2, title: "Cyber Sunset", views: 189, likes: 32, image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&h=300&fit=crop" },
        { id: 3, title: "Digital Bloom", views: 567, likes: 120, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&h=300&fit=crop" },
    ];

    const activities = [
        { id: 1, type: "like", user: "Sarah Chen", target: "Neon Dreams", time: "2 hours ago" },
        { id: 2, type: "download", user: "Mark Wilson", target: "Cyber Sunset", time: "5 hours ago" },
        { id: 3, type: "follow", user: "Alex Rivera", target: "you", time: "Yesterday" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="lg:w-64 space-y-6">
                        <div className="glass rounded-2xl p-6 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4 group">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                    alt={user?.name}
                                    className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-xl"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-semibold">Edit</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 capitalize">{user?.role}</p>
                            <Link
                                to="/profile/edit"
                                className="inline-block px-4 py-2 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/10 rounded-full hover:bg-primary-100 transition-colors"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <nav className="glass rounded-2xl p-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <span>🏠</span> Overview
                            </button>
                            <Link
                                to="/my-uploads"
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'artworks' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <span>🎨</span> My Artworks
                            </Link>
                            <Link
                                to="/my-purchases"
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <span>🛍️</span> My Purchases
                            </Link>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <span>⚙️</span> Settings
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">
                        {/* Header Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="glass rounded-2xl p-6 transition-transform hover:scale-[1.02]">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">{stat.icon}</span>
                                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{stat.trend}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Middle Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Recent Artworks */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Artworks</h3>
                                    <Link to="/explore" className="text-sm font-medium text-primary-600 hover:text-primary-500">View All</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recentArtworks.map((art) => (
                                        <div key={art.id} className="glass rounded-2xl overflow-hidden group">
                                            <div className="h-48 overflow-hidden relative">
                                                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <div className="flex gap-4 text-white text-xs">
                                                        <span>👁️ {art.views}</span>
                                                        <span>❤️ {art.likes}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{art.title}</h4>
                                                <p className="text-xs text-gray-500">Last updated: 3 days ago</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Link
                                        to="/upload"
                                        className="h-full min-h-[150px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50/50 transition-all group"
                                    >
                                        <span className="text-3xl text-gray-400 group-hover:text-primary-500 transition-colors">+</span>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600">Upload New Work</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity</h3>
                                <div className="glass rounded-2xl p-6 space-y-6">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                {activity.user[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    <span className="font-bold">{activity.user}</span>
                                                    {activity.type === 'like' && ' liked your artwork '}
                                                    {activity.type === 'download' && ' downloaded '}
                                                    {activity.type === 'follow' && ' followed '}
                                                    <span className="text-primary-600 font-medium">"{activity.target}"</span>
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Stats Upgrade */}
                                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20">
                                    <h4 className="font-bold mb-2">Become an Artist</h4>
                                    <p className="text-xs text-indigo-100 mb-4 opacity-80">Start selling your digital creations to our global community.</p>
                                    <button className="w-full py-2 bg-white text-primary-600 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                                        Join Artist Program
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
