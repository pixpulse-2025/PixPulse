import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalArtistEarnings: 0,
        totalAdminCommission: 0,
        totalDeposits: 0,
        transactionCount: 0,
    });
    const [revenueBreakdown, setRevenueBreakdown] = useState({
        totalRevenue: 0,
        artistRevenue: 0,
        adminRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("transactions");
    const [typeFilter, setTypeFilter] = useState("all");
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    useEffect(() => {
        fetchData();
    }, [typeFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [txRes, orderRes] = await Promise.all([
                axios.get(`${API_URL}/admin/transactions?type=${typeFilter}&limit=50`),
                axios.get(`${API_URL}/admin/orders?limit=50`),
            ]);

            setTransactions(txRes.data.data || []);
            setSummary(txRes.data.summary || {});
            setPagination(txRes.data.pagination || {});

            setOrders(orderRes.data.data || []);
            setRevenueBreakdown(orderRes.data.revenueBreakdown || {});
        } catch (error) {
            console.error("Error fetching admin transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return `$${Math.abs(amount || 0).toFixed(2)}`;
    };

    const getTypeStyles = (type) => {
        const styles = {
            deposit: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Deposit", icon: "↓" },
            purchase: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", label: "Purchase", icon: "🛒" },
            earning: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Artist Earning (90%)", icon: "💰" },
            admin_commission: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", label: "Admin Commission (10%)", icon: "🏛️" },
            refund: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Refund", icon: "↩️" },
        };
        return styles[type] || { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20", label: type, icon: "•" };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading transaction data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Transaction History</h1>
                        </div>
                        <p className="text-gray-400">Complete revenue tracking with 90/10 split breakdown</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm transition-all active:scale-95"
                    >
                        🔄 Refresh Data
                    </button>
                </div>

                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Total Sales */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-[#141821] to-violet-600/5 border border-white/5 p-6">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                                    <span className="text-lg">💎</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Sales</p>
                            </div>
                            <p className="text-3xl font-bold text-white tabular-nums">{formatCurrency(summary.totalSales)}</p>
                            <p className="text-xs text-gray-500 mt-1">{pagination.total} transactions total</p>
                        </div>
                    </div>

                    {/* Artist Revenue (90%) */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600/20 via-[#141821] to-amber-600/5 border border-white/5 p-6">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                                    <span className="text-lg">🎨</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Artist Revenue (90%)</p>
                            </div>
                            <p className="text-3xl font-bold text-amber-400 tabular-nums">{formatCurrency(summary.totalArtistEarnings)}</p>
                            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                                    style={{ width: summary.totalSales > 0 ? `${(summary.totalArtistEarnings / summary.totalSales) * 100}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Commission (10%) */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/20 via-[#141821] to-cyan-600/5 border border-white/5 p-6">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                                    <span className="text-lg">🏛️</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Admin Commission (10%)</p>
                            </div>
                            <p className="text-3xl font-bold text-cyan-400 tabular-nums">{formatCurrency(summary.totalAdminCommission)}</p>
                            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-700"
                                    style={{ width: summary.totalSales > 0 ? `${(summary.totalAdminCommission / summary.totalSales) * 100}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Total Deposits */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-[#141821] to-emerald-600/5 border border-white/5 p-6">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                    <span className="text-lg">💳</span>
                                </div>
                                <p className="text-sm font-medium text-gray-400">Total Deposits</p>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400 tabular-nums">{formatCurrency(summary.totalDeposits)}</p>
                            <p className="text-xs text-gray-500 mt-1">User wallet deposits</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Split Visual */}
                {revenueBreakdown.totalRevenue > 0 && (
                    <div className="rounded-2xl bg-[#141821] border border-white/5 p-6 mb-8">
                        <h3 className="text-lg font-bold text-white mb-4">Revenue Distribution</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 h-8 rounded-full bg-white/5 overflow-hidden flex">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center text-xs font-bold text-black transition-all duration-700"
                                    style={{ width: '90%' }}
                                >
                                    90% Artist
                                </div>
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-black transition-all duration-700"
                                    style={{ width: '10%' }}
                                >
                                    10%
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(revenueBreakdown.totalRevenue)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">→ Artists (90%)</p>
                                <p className="text-xl font-bold text-amber-400">{formatCurrency(revenueBreakdown.artistRevenue)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">→ Admin (10%)</p>
                                <p className="text-xl font-bold text-cyan-400">{formatCurrency(revenueBreakdown.adminRevenue)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("transactions")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "transactions"
                            ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20"
                            : "bg-[#141821] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5"
                            }`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "orders"
                            ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20"
                            : "bg-[#141821] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5"
                            }`}
                    >
                        Order History
                    </button>
                </div>

                {/* Transactions Tab */}
                {activeTab === "transactions" && (
                    <div>
                        {/* Type Filters */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { id: "all", label: "All" },
                                { id: "purchase", label: "Purchases" },
                                { id: "earning", label: "Artist Earnings" },
                                { id: "admin_commission", label: "Admin Commission" },
                                { id: "deposit", label: "Deposits" },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setTypeFilter(f.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${typeFilter === f.id
                                        ? "bg-white/10 text-white border border-white/20"
                                        : "bg-white/5 text-gray-500 hover:text-gray-300 border border-transparent"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Transactions Table */}
                        <div className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Artwork</th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue Split</th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => {
                                                const typeStyle = getTypeStyles(tx.type);
                                                return (
                                                    <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                                                                <span>{typeStyle.icon}</span>
                                                                {typeStyle.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                                                    <img
                                                                        src={tx.user?.avatar || `https://ui-avatars.com/api/?name=${tx.user?.name}&background=random`}
                                                                        alt={tx.user?.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{tx.user?.name || "Unknown"}</p>
                                                                    <p className="text-xs text-gray-500">{tx.user?.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-300 max-w-[250px] truncate">
                                                                {tx.description}
                                                            </p>
                                                            {tx.order && (
                                                                <p className="text-xs text-gray-600 mt-0.5">
                                                                    Order: {tx.order.orderNumber}
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {tx.artwork ? (
                                                                <p className="text-sm text-gray-400 truncate max-w-[150px]">
                                                                    {tx.artwork.title}
                                                                </p>
                                                            ) : (
                                                                <span className="text-xs text-gray-600">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {tx.revenueBreakdown?.originalPrice ? (
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs text-gray-500">
                                                                        Sale: ${tx.revenueBreakdown.originalPrice.toFixed(2)}
                                                                    </p>
                                                                    <p className="text-xs text-amber-400/80">
                                                                        Artist: ${tx.revenueBreakdown.artistShare.toFixed(2)}
                                                                    </p>
                                                                    <p className="text-xs text-cyan-400/80">
                                                                        Admin: ${tx.revenueBreakdown.adminShare.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-600">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <p className="text-xs text-gray-500 whitespace-nowrap">
                                                                {formatDate(tx.createdAt)}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="rounded-2xl bg-[#141821] border border-white/5 py-16 text-center">
                                <p className="text-gray-500">No orders found</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                                    <img
                                                        src={order.user?.avatar || `https://ui-avatars.com/api/?name=${order.user?.name}&background=random`}
                                                        alt={order.user?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{order.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-bold text-white">#{order.orderNumber}</p>
                                                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                                                <p className="text-lg font-bold text-white">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-amber-400/70 mb-0.5">Artist (90%)</p>
                                                <p className="text-sm font-semibold text-amber-400">${(order.totalAmount * 0.9).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-cyan-400/70 mb-0.5">Admin (10%)</p>
                                                <p className="text-sm font-semibold text-cyan-400">${(order.totalAmount * 0.1).toFixed(2)}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${order.paymentStatus === 'completed'
                                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                : order.paymentStatus === 'pending'
                                                    ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                                                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="divide-y divide-white/5">
                                        {order.items.map((item, idx) => {
                                            const artwork = item.artwork;
                                            const previewUrl = artwork?.previewUrl
                                                ? (artwork.previewUrl.startsWith("http") ? artwork.previewUrl : `http://localhost:5000${artwork.previewUrl}`)
                                                : null;
                                            const fileUrl = artwork?.fileUrl
                                                ? (artwork.fileUrl.startsWith("http") ? artwork.fileUrl : `http://localhost:5000${artwork.fileUrl}`)
                                                : null;
                                            const displayUrl = previewUrl || fileUrl || `https://ui-avatars.com/api/?name=${item.title}&background=6366f1&color=fff`;

                                            const itemArtistShare = Math.round(item.price * 0.9 * 100) / 100;
                                            const itemAdminShare = Math.round(item.price * 0.1 * 100) / 100;

                                            return (
                                                <div key={idx} className="px-6 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                                                        <img src={displayUrl} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs text-gray-500">{item.licenseType} License</span>
                                                            {artwork?.artist && (
                                                                <span className="text-xs text-gray-600">• by {artwork.artist.name}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-white">${item.price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-right hidden lg:block">
                                                            <p className="text-xs text-amber-400/70">→ Artist: ${itemArtistShare.toFixed(2)}</p>
                                                            <p className="text-xs text-cyan-400/70">→ Admin: ${itemAdminShare.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTransactions;
