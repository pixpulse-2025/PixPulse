import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        users: { total: 0, newThisMonth: 0 },
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
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                const s = data.data;
                setStats({
                    users: s.users,
                    artworks: s.artworks,
                    orders: s.orders,
                    reports: s.reports
                });

                // Create recent activity feed from consolidated data
                const activities = [];

                // Recent users
                s.recent.users.forEach(u => {
                    activities.push({
                        type: 'user',
                        message: `New user registered: ${u.name}`,
                        time: u.createdAt,
                        icon: '👤'
                    });
                });

                // Recent artworks
                s.recent.artworks.forEach(a => {
                    activities.push({
                        type: 'artwork',
                        message: `New artwork uploaded: ${a.title}`,
                        time: a.createdAt,
                        icon: '🎨'
                    });
                });

                // Recent orders
                s.recent.orders.forEach(o => {
                    activities.push({
                        type: 'order',
                        message: `New order: $${o.totalAmount.toFixed(2)}`,
                        time: o.createdAt,
                        icon: '💰'
                    });
                });

                // Sort by time and take top 10
                activities.sort((a, b) => new Date(b.time) - new Date(a.time));
                setRecentActivity(activities.slice(0, 10));
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon, color, gradientFrom, gradientTo, blobColor, iconBg, link }) => (
        <Link to={link} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFrom} via-[#141821] ${gradientTo} border border-white/5 p-6 hover:shadow-xl hover:border-white/10 transition-all group block`}>
            {/* Glow blob */}
            <div className={`absolute top-0 right-0 w-28 h-28 ${blobColor} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-lg">{icon}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                </div>
                <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
                <div className={`text-xs ${color} font-medium mt-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                    View Details →
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">
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
                        color="text-blue-400"
                        gradientFrom="from-blue-600/20"
                        gradientTo="to-blue-600/5"
                        blobColor="bg-blue-500/10"
                        iconBg="bg-blue-500/15"
                        link="/admin/users"
                    />
                    <StatCard
                        title="Total Artworks"
                        value={stats.artworks.total}
                        subtitle={`${stats.artworks.paid} paid, ${stats.artworks.free} free`}
                        icon="🎨"
                        color="text-violet-400"
                        gradientFrom="from-violet-600/20"
                        gradientTo="to-violet-600/5"
                        blobColor="bg-violet-500/10"
                        iconBg="bg-violet-500/15"
                        link="/admin/artworks"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.orders.revenue.toFixed(2)}`}
                        subtitle={`Artists: $${(stats.orders.revenue * 0.9).toFixed(2)} | Admin: $${(stats.orders.revenue * 0.1).toFixed(2)}`}
                        icon="💰"
                        color="text-emerald-400"
                        gradientFrom="from-emerald-600/20"
                        gradientTo="to-emerald-600/5"
                        blobColor="bg-emerald-500/10"
                        iconBg="bg-emerald-500/15"
                        link="/admin/transactions"
                    />
                    <StatCard
                        title="Reports"
                        value={stats.reports.total}
                        subtitle={`${stats.reports.pending} pending review`}
                        icon="🚩"
                        color="text-red-400"
                        gradientFrom="from-red-600/20"
                        gradientTo="to-red-600/5"
                        blobColor="bg-red-500/10"
                        iconBg="bg-red-500/15"
                        link="/admin/reports"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">User Breakdown</h3>
                            <span className="text-2xl">👤</span>
                        </div>
                        <div className="space-y-3">

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Regular Users</span>
                                <span className="font-bold text-white">
                                    {stats.users.total - (stats.users.admins || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">New This Month</span>
                                <span className="font-bold text-green-500">{stats.users.newThisMonth}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">Content Stats</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Paid Artworks</span>
                                <span className="font-bold text-white">{stats.artworks.paid}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Free Artworks</span>
                                <span className="font-bold text-white">{stats.artworks.free}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Pending Review</span>
                                <span className="font-bold text-yellow-500">{stats.artworks.pending}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">Report Status</h3>
                            <span className="text-2xl">🚨</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Total Reports</span>
                                <span className="font-bold text-white">{stats.reports.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Pending</span>
                                <span className="font-bold text-yellow-500">{stats.reports.pending}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Resolved</span>
                                <span className="font-bold text-green-500">{stats.reports.resolved}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <button
                            onClick={fetchDashboardStats}
                            className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-medium"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(activity.time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No recent activity
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">
                    <Link
                        to="/admin/users"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                        <p className="font-medium text-white">Manage Users</p>
                    </Link>
                    <Link
                        to="/admin/artworks"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                        <p className="font-medium text-white">Manage Artworks</p>
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                        <p className="font-medium text-white">View Analytics</p>
                    </Link>
                    <Link
                        to="/admin/reports"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🚩</div>
                        <p className="font-medium text-white">Review Reports</p>
                    </Link>

                    <Link
                        to="/admin/transactions"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💳</div>
                        <p className="font-medium text-white">Transactions</p>
                    </Link>
                    <Link
                        to="/admin/messages"
                        className="p-4 border border-white/10 rounded-xl hover:border-[#8B5CF6] transition-all text-center group bg-[#141821]"
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✉️</div>
                        <p className="font-medium text-white">Messages</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
