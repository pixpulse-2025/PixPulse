import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        topCreators: [],
        topSales: [],
        revenueByCategory: [],
        recentActivity: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-400">
                            Platform insights and performance metrics
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchAnalytics}
                            className="btn-primary px-4 py-2 text-white rounded-lg transition-colors"
                        >
                            🔄 Refresh
                        </button>
                        <Link
                            to="/admin"
                            className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-[#141821] to-emerald-600/5 border border-white/5 p-6 group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-lg">💰</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400 tabular-nums">${analytics.totalRevenue?.toFixed(2) || 0}</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-[#141821] to-blue-600/5 border border-white/5 p-6 group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-lg">📦</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Orders</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-400 tabular-nums">{analytics.totalOrders || 0}</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-[#141821] to-violet-600/5 border border-white/5 p-6 group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-lg">🎨</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Artworks</p>
                            </div>
                            <p className="text-3xl font-bold text-violet-400 tabular-nums">{analytics.totalArtworks || 0}</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600/20 via-[#141821] to-amber-600/5 border border-white/5 p-6 group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-lg">👥</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Users</p>
                            </div>
                            <p className="text-3xl font-bold text-amber-400 tabular-nums">{analytics.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Creators */}
                    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                🎨 Top Creators
                            </h2>
                            <span className="text-sm text-gray-400">
                                By artwork count
                            </span>
                        </div>

                        {analytics.topCreators.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topCreators.map((creator, index) => (
                                    <div
                                        key={creator.artist?._id || index}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full font-bold">
                                            #{index + 1}
                                        </div>
                                        <img
                                            src={creator.artist?.avatar || `https://ui-avatars.com/api/?name=${creator.artist?.name}&background=random`}
                                            alt={creator.artist?.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-white">
                                                {creator.artist?.name || "Unknown"}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {creator.artworkCount} artworks • {creator.totalViews} views
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-white">
                                                {creator.totalDownloads}
                                            </p>
                                            <p className="text-xs text-gray-400">downloads</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                No creator data available
                            </div>
                        )}
                    </div>

                    {/* Top Sales */}
                    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                💰 Top Sales
                            </h2>
                            <span className="text-sm text-gray-400">
                                By revenue
                            </span>
                        </div>

                        {analytics.topSales.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topSales.map((sale, index) => (
                                    <div
                                        key={sale.artwork?._id || index}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-500 rounded-full font-bold">
                                            #{index + 1}
                                        </div>
                                        <img
                                            src={`http://localhost:5000${sale.artwork?.previewUrl || sale.artwork?.fileUrl}`}
                                            alt={sale.artwork?.title}
                                            className="w-12 h-12 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-white truncate">
                                                {sale.artwork?.title || "Unknown"}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {sale.salesCount} sales
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-500">
                                                ${sale.totalRevenue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                No sales data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        📊 Revenue by Category
                    </h2>

                    {analytics.revenueByCategory.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analytics.revenueByCategory.map((item, index) => {
                                const percentage = analytics.totalRevenue > 0
                                    ? (item.revenue / analytics.totalRevenue * 100).toFixed(1)
                                    : 0;

                                return (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border border-white/10 hover:border-[#8B5CF6] transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-white">
                                                {item.category}
                                            </p>
                                            <span className="text-sm text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-[#8B5CF6]">
                                            ${item.revenue.toFixed(2)}
                                        </p>
                                        <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#8B5CF6] rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No revenue data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
