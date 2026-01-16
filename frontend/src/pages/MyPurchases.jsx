import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../redux/slices/ordersSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyPurchases = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [filter, setFilter] = useState("all"); // all, completed, pending
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleDownload = async (artworkId, artworkTitle) => {
        try {
            setDownloading(artworkId);

            // Use secure download endpoint
            const response = await axios.get(`${API_URL}/download/${artworkId}`, {
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', artworkTitle || 'artwork');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.response?.data?.message || 'Download failed. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        if (filter === "completed") return order.paymentStatus === "completed";
        if (filter === "pending") return order.paymentStatus === "pending";
        return true;
    });

    const getStatusBadge = (status) => {
        const badges = {
            completed: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
            pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
            failed: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
            cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
        };
        return badges[status] || badges.pending;
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading purchases...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Purchases</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === "all"
                            ? "bg-primary-600 text-white shadow-lg"
                            : "glass text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === "completed"
                            ? "bg-primary-600 text-white shadow-lg"
                            : "glass text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === "pending"
                            ? "bg-primary-600 text-white shadow-lg"
                            : "glass text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Pending
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {filter === "all" ? "No purchases yet" : `No ${filter} orders`}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Start exploring and purchasing amazing artworks!
                        </p>
                        <Link
                            to="/marketplace"
                            className="inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                        >
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="glass rounded-3xl overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.paymentStatus)}`}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => {
                                            const artwork = item.artwork;
                                            return (
                                                <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl">
                                                    {/* Thumbnail */}
                                                    <Link
                                                        to={artwork ? `/artwork/${artwork._id}` : "#"}
                                                        className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800"
                                                    >
                                                        <img
                                                            src={
                                                                artwork
                                                                    ? `http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`
                                                                    : item.previewUrl
                                                                        ? `http://localhost:5000${item.previewUrl}`
                                                                        : "http://localhost:5000/uploads/placeholders/default-preview.png"
                                                            }
                                                            alt={item.title}
                                                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                                            onError={(e) => {
                                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                                            }}
                                                        />
                                                    </Link>

                                                    {/* Details */}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            {item.licenseType} License
                                                        </p>
                                                        {artwork && (
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                                                    alt={artwork.artist?.name}
                                                                    className="w-5 h-5 rounded-full"
                                                                />
                                                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                                                    {artwork.artist?.name || "Anonymous"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price & Download */}
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                            ${item.price.toFixed(2)}
                                                        </p>
                                                        {order.paymentStatus === "completed" && order.downloadLinks && (
                                                            <button
                                                                onClick={() => handleDownload(artwork?._id || item.artwork, item.title)}
                                                                disabled={downloading === (artwork?._id || item.artwork)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {downloading === (artwork?._id || item.artwork) ? '⏳ Downloading...' : '📥 Download'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Download All Button */}
                                    {order.paymentStatus === "completed" && order.items.length > 1 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                            <button className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                                                📥 Download All Files
                                            </button>
                                        </div>
                                    )}

                                    {/* Expiration Notice */}
                                    {order.paymentStatus === "completed" && order.downloadLinks && order.downloadLinks.length > 0 && (
                                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                                ⏰ Download links expire on{" "}
                                                {new Date(order.downloadLinks[0].expiresAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPurchases;
