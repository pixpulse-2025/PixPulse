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

            // Fetch data
            const [usersRes, artworksRes, ordersRes] = await Promise.all([
                axios.get(`${API_URL}/users`).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_URL}/artworks`).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_URL}/orders`).catch(() => ({ data: { data: [] } }))
            ]);

            const users = usersRes.data.data || [];
            const artworks = artworksRes.data.data || [];
            const orders = ordersRes.data.data || [];

            // Calculate top creators (by number of artworks)
            const creatorStats = {};
            artworks.forEach(artwork => {
                const artistId = artwork.artist?._id || artwork.artist;
                if (!artistId) return;

                if (!creatorStats[artistId]) {
                    creatorStats[artistId] = {
                        artist: artwork.artist,
                        artworkCount: 0,
                        totalViews: 0,
                        totalDownloads: 0
                    };
                }

                creatorStats[artistId].artworkCount++;
                creatorStats[artistId].totalViews += artwork.views || 0;
                creatorStats[artistId].totalDownloads += artwork.downloads || 0;
            });

            const topCreators = Object.values(creatorStats)
                .sort((a, b) => b.artworkCount - a.artworkCount)
                .slice(0, 10);

            // Calculate top sales (artworks by revenue)
            const salesStats = {};
            orders.forEach(order => {
                order.items?.forEach(item => {
                    const artworkId = item.artwork?._id || item.artwork;
                    if (!artworkId) return;

                    if (!salesStats[artworkId]) {
                        salesStats[artworkId] = {
                            artwork: item.artwork,
                            salesCount: 0,
                            totalRevenue: 0
                        };
                    }

                    salesStats[artworkId].salesCount++;
                    salesStats[artworkId].totalRevenue += item.price || 0;
                });
            });

            const topSales = Object.values(salesStats)
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 10);

            // Revenue by category
            const categoryRevenue = {};
            orders.forEach(order => {
                order.items?.forEach(item => {
                    const category = item.artwork?.category || 'Other';
                    if (!categoryRevenue[category]) {
                        categoryRevenue[category] = 0;
                    }
                    categoryRevenue[category] += item.price || 0;
                });
            });

            const revenueByCategory = Object.entries(categoryRevenue)
                .map(([category, revenue]) => ({ category, revenue }))
                .sort((a, b) => b.revenue - a.revenue);

            setAnalytics({
                topCreators,
                topSales,
                revenueByCategory,
                totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
                totalOrders: orders.length,
                totalArtworks: artworks.length,
                totalUsers: users.length
            });

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Platform insights and performance metrics
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchAnalytics}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            🔄 Refresh
                        </button>
                        <Link
                            to="/admin"
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-600">${analytics.totalRevenue?.toFixed(2) || 0}</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-600">{analytics.totalOrders || 0}</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Artworks</p>
                        <p className="text-3xl font-bold text-purple-600">{analytics.totalArtworks || 0}</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-orange-600">{analytics.totalUsers || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Creators */}
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                🎨 Top Creators
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                By artwork count
                            </span>
                        </div>

                        {analytics.topCreators.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topCreators.map((creator, index) => (
                                    <div
                                        key={creator.artist?._id || index}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-bold">
                                            #{index + 1}
                                        </div>
                                        <img
                                            src={creator.artist?.avatar || `https://ui-avatars.com/api/?name=${creator.artist?.name}&background=random`}
                                            alt={creator.artist?.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {creator.artist?.name || "Unknown"}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {creator.artworkCount} artworks • {creator.totalViews} views
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {creator.totalDownloads}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">downloads</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No creator data available
                            </div>
                        )}
                    </div>

                    {/* Top Sales */}
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                💰 Top Sales
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                By revenue
                            </span>
                        </div>

                        {analytics.topSales.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topSales.map((sale, index) => (
                                    <div
                                        key={sale.artwork?._id || index}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full font-bold">
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
                                            <p className="font-bold text-gray-900 dark:text-white truncate">
                                                {sale.artwork?.title || "Unknown"}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {sale.salesCount} sales
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                ${sale.totalRevenue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No sales data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
                                        className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {item.category}
                                            </p>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-primary-600">
                                            ${item.revenue.toFixed(2)}
                                        </p>
                                        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-600 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No revenue data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
