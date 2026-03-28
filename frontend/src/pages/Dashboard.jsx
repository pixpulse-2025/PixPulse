import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

    const [overviewStats, setOverviewStats] = useState({
        artworks: 0,
        views: 0,
        downloads: 0,
        revenue: 0
    });
    const [performance, setPerformance] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [allActivity, setAllActivity] = useState([]);
    const [showAllActivity, setShowAllActivity] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                // Fetch user's artworks
                const artworksRes = await axios.get(`${API_URL}/artworks/my-uploads`);
                const artworks = artworksRes.data.data || [];

                // Fetch user's purchases (orders)
                const ordersRes = await axios.get(`${API_URL}/checkout/orders`).catch(() => ({ data: { data: [] } }));
                const orders = ordersRes.data.data || [];

                // Calculate total views and downloads
                const totalViews = artworks.reduce((sum, art) => sum + (art.views || 0), 0);
                const totalDownloads = artworks.reduce((sum, art) => sum + (art.downloads || 0), 0);

                // Calculate revenue: sum of completed orders where user's artwork was bought
                // For each artwork belonging to this user sold in any order, artist earns 90%
                let totalRevenue = 0;
                try {
                    const walletRes = await axios.get(`${API_URL}/wallet/balance`);
                    const transactions = walletRes.data?.data?.transactions || [];
                    totalRevenue = transactions
                        .filter(t => t.type === 'earning')
                        .reduce((sum, t) => sum + (t.amount || 0), 0);
                } catch (e) {
                    // If wallet fetch fails, just use 0
                }

                setOverviewStats({
                    artworks: artworks.length,
                    views: totalViews,
                    downloads: totalDownloads,
                    revenue: totalRevenue
                });

                // Calculate Performance (Top 3 viewed artworks)
                const sortedArtworks = [...artworks].sort((a, b) => (b.views || 0) - (a.views || 0));
                setPerformance(sortedArtworks.slice(0, 3));

                // Calculate Recent Activity (Uploads + Purchases)
                const activities = [];

                // Add uploads
                artworks.forEach(art => {
                    activities.push({
                        type: 'uploaded',
                        target: art.title,
                        time: art.createdAt,
                        rawTime: new Date(art.createdAt)
                    });
                });

                // Add purchases
                orders.forEach(order => {
                    if (order.items && order.items.length > 0) {
                        activities.push({
                            type: 'purchased',
                            target: `${order.items.length} item${order.items.length > 1 ? 's' : ''}`,
                            time: order.createdAt,
                            rawTime: new Date(order.createdAt)
                        });
                    }
                });

                // Sort by time desc and take top 5
                activities.sort((a, b) => b.rawTime - a.rawTime);
                setAllActivity(activities);
                setRecentActivity(activities.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, [user]);

    // Real data for the dashboard
    const stats = [
        { label: "Total Artworks", value: overviewStats.artworks, trend: "Lifetime count", icon: "📊", color: "text-violet-400", gradientFrom: "from-violet-600/20", gradientTo: "to-violet-600/5", blobColor: "bg-violet-500/10", iconBg: "bg-violet-500/15" },
        { label: "Total Views", value: overviewStats.views, trend: "Across all uploads", icon: "👁️", color: "text-blue-400", gradientFrom: "from-blue-600/20", gradientTo: "to-blue-600/5", blobColor: "bg-blue-500/10", iconBg: "bg-blue-500/15" },
        { label: "Downloads", value: overviewStats.downloads, trend: "Total downloads", icon: "⬇️", color: "text-cyan-400", gradientFrom: "from-cyan-600/20", gradientTo: "to-cyan-600/5", blobColor: "bg-cyan-500/10", iconBg: "bg-cyan-500/15" },
        { label: "Revenue", value: `$${overviewStats.revenue}`, trend: "Total earned", icon: "💰", color: "text-emerald-400", gradientFrom: "from-emerald-600/20", gradientTo: "to-emerald-600/5", blobColor: "bg-emerald-500/10", iconBg: "bg-emerald-500/15" },
    ];



    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Navigation Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        <div className="card-surface p-6 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <img
                                    src={user?.avatar ? (user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : `http://localhost:5000${user.avatar}`) : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0369a1&color=fff`}
                                    alt={user?.name}
                                    className="w-full h-full rounded-full border-4 border-[#141821] object-cover"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-white truncate mb-1">{user?.name}</h2>
                            <p className="text-sm text-gray-400 mb-4">{user?.artistType || user?.role || "Member"}</p>
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
                                    ? 'bg-[#8B5CF6] text-white'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Overview
                            </button>
                            <Link
                                to="/my-uploads"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                My Artworks
                            </Link>
                            <Link
                                to="/my-purchases"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                My Purchases
                            </Link>
                            <Link
                                to="/wallet"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                Wallet
                            </Link>
                            <Link
                                to="/favorites"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                Favorites
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Dashboard
                            </h1>
                            <p className="text-base text-gray-400">Welcome back, {user?.name}! Here's your account overview.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradientFrom} via-[#141821] ${stat.gradientTo} border border-white/5 p-6 hover:shadow-xl hover:border-white/10 transition-all group`}>
                                    <div className={`absolute top-0 right-0 w-28 h-28 ${stat.blobColor} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <span className="text-lg">{stat.icon}</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                        </div>
                                        <p className={`text-3xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Performance Overview (Top Viewed Artworks) */}
                            <div className="lg:col-span-2 card-surface p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Performance Overview</h3>
                                {performance.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            <div className="col-span-6">Artwork</div>
                                            <div className="col-span-3 text-right">Views</div>
                                            <div className="col-span-3 text-right">Downloads</div>
                                        </div>
                                        {performance.map((artwork) => (
                                            <div key={artwork._id} className="grid grid-cols-12 items-center gap-4 py-3 border-b border-white/5 last:border-0">
                                                <div className="col-span-6 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-[#141821] overflow-hidden flex-shrink-0 border border-white/5">
                                                        <img src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`} alt={artwork.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-white truncate">{artwork.title}</p>
                                                        <p className="text-xs text-gray-400">{artwork.category}</p>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-right font-medium text-white">
                                                    {artwork.views}
                                                </div>
                                                <div className="col-span-3 text-right font-medium text-white">
                                                    {artwork.downloads}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center bg-[#0B0D10]/50 rounded-lg border border-white/5">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                            <p className="text-gray-400 font-medium">No performance data available</p>
                                            <p className="text-sm text-gray-500 mt-1">Upload artworks to see stats</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recent Activity */}
                            <div className="card-surface p-6 h-full flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                <div className="space-y-4 overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {allActivity.length > 0 ? (
                                        allActivity.map((activity, index) => (
                                            <div key={index} className="flex gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'uploaded' ? 'bg-[#8B5CF6]' : 'bg-green-500'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white">
                                                        <span className="font-semibold text-gray-400 capitalize">{activity.type}</span> <span className="font-semibold">{activity.target}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(activity.time).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                                    )}
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
