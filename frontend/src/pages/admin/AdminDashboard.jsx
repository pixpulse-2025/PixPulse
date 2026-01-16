import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        users: { total: 0, artists: 0, newThisMonth: 0 },
        artworks: { total: 0, paid: 0, free: 0, pending: 0 },
        orders: { total: 0, revenue: 0, thisMonth: 0 },
        reports: { total: 0, pending: 0, resolved: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [usersRes, artworksRes, ordersRes, reportsRes] = await Promise.all([
                axios.get(`${API_URL}/users`).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_URL}/artworks`).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_URL}/orders`).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_URL}/reports`).catch(() => ({ data: { data: [] } }))
            ]);

            // Calculate user stats
            const users = usersRes.data.data || [];
            const userStats = {
                total: users.length,
                artists: users.filter(u => u.role === 'artist').length,
                newThisMonth: users.filter(u => {
                    const created = new Date(u.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear();
                }).length
            };

            // Calculate artwork stats
            const artworks = artworksRes.data.data || [];
            const artworkStats = {
                total: artworks.length,
                paid: artworks.filter(a => a.priceType === 'Paid').length,
                free: artworks.filter(a => a.priceType === 'Free').length,
                pending: artworks.filter(a => a.status === 'pending').length
            };

            // Calculate order stats
            const orders = ordersRes.data.data || [];
            const orderStats = {
                total: orders.length,
                revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
                thisMonth: orders.filter(o => {
                    const created = new Date(o.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear();
                }).length
            };

            // Calculate report stats
            const reports = reportsRes.data.data || [];
            const reportStats = {
                total: reports.length,
                pending: reports.filter(r => r.status === 'pending').length,
                resolved: reports.filter(r => r.status === 'resolved').length
            };

            setStats({
                users: userStats,
                artworks: artworkStats,
                orders: orderStats,
                reports: reportStats
            });

            // Create recent activity feed
            const activities = [];

            // Recent users
            users.slice(0, 3).forEach(u => {
                activities.push({
                    type: 'user',
                    message: `New user registered: ${u.name}`,
                    time: u.createdAt,
                    icon: '👤'
                });
            });

            // Recent artworks
            artworks.slice(0, 3).forEach(a => {
                activities.push({
                    type: 'artwork',
                    message: `New artwork uploaded: ${a.title}`,
                    time: a.createdAt,
                    icon: '🎨'
                });
            });

            // Recent orders
            orders.slice(0, 3).forEach(o => {
                activities.push({
                    type: 'order',
                    message: `New order: $${o.totalAmount}`,
                    time: o.createdAt,
                    icon: '💰'
                });
            });

            // Sort by time and take top 10
            activities.sort((a, b) => new Date(b.time) - new Date(a.time));
            setRecentActivity(activities.slice(0, 10));

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon, color, link }) => (
        <Link to={link} className="glass rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`text-4xl ${color} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                View Details →
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome back, {user?.name}! Here's what's happening with PixPulse.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.users.total}
                        subtitle={`${stats.users.newThisMonth} new this month`}
                        icon="👥"
                        color="text-blue-500"
                        link="/admin/users"
                    />
                    <StatCard
                        title="Total Artworks"
                        value={stats.artworks.total}
                        subtitle={`${stats.artworks.paid} paid, ${stats.artworks.free} free`}
                        icon="🎨"
                        color="text-purple-500"
                        link="/admin/artworks"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.orders.revenue.toFixed(2)}`}
                        subtitle={`${stats.orders.thisMonth} orders this month`}
                        icon="💰"
                        color="text-green-500"
                        link="/admin/orders"
                    />
                    <StatCard
                        title="Reports"
                        value={stats.reports.total}
                        subtitle={`${stats.reports.pending} pending review`}
                        icon="🚩"
                        color="text-red-500"
                        link="/admin/reports"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">User Breakdown</h3>
                            <span className="text-2xl">👤</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Artists</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats.users.artists}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Regular Users</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {stats.users.total - stats.users.artists}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">New This Month</span>
                                <span className="font-bold text-green-600">{stats.users.newThisMonth}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Content Stats</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Paid Artworks</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats.artworks.paid}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Free Artworks</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats.artworks.free}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Review</span>
                                <span className="font-bold text-yellow-600">{stats.artworks.pending}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Report Status</h3>
                            <span className="text-2xl">🚨</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Reports</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stats.reports.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                                <span className="font-bold text-yellow-600">{stats.reports.pending}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                                <span className="font-bold text-green-600">{stats.reports.resolved}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        <button
                            onClick={fetchDashboardStats}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(activity.time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No recent activity
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                    <Link
                        to="/admin/users"
                        className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center group"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                        <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                    </Link>
                    <Link
                        to="/admin/artworks"
                        className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center group"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                        <p className="font-medium text-gray-900 dark:text-white">Manage Artworks</p>
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center group"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                        <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
                    </Link>
                    <Link
                        to="/admin/reports"
                        className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center group"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🚩</div>
                        <p className="font-medium text-gray-900 dark:text-white">Review Reports</p>
                    </Link>
                    <Link
                        to="/marketplace"
                        className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center group"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏪</div>
                        <p className="font-medium text-gray-900 dark:text-white">View Marketplace</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
