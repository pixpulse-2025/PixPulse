import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../redux/slices/ordersSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyPurchases = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [filter, setFilter] = useState("all");
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleDownload = async (artworkId, artworkTitle) => {
        try {
            setDownloading(artworkId);
            const response = await axios.get(`${API_URL}/download/${artworkId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            // Determine extension from Content-Type
            const mimeType = response.headers['content-type'];
            let extension = 'jpg'; // Default

            if (mimeType) {
                const mimeMap = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'image/gif': 'gif',
                    'image/webp': 'webp',
                    'video/mp4': 'mp4',
                    'video/webm': 'webm',
                    'video/quicktime': 'mov',
                    'audio/mpeg': 'mp3',
                    'audio/wav': 'wav',
                    'audio/ogg': 'ogg',
                    'application/pdf': 'pdf'
                };
                if (mimeMap[mimeType]) {
                    extension = mimeMap[mimeType];
                }
            }

            const link = document.createElement('a');
            link.href = url;
            // Clean title and append extension
            const safeTitle = (artworkTitle || 'artwork').replace(/[^a-z0-9]/gi, '_');
            link.setAttribute('download', `${safeTitle}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
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

    const getStatusStyles = (status) => {
        const styles = {
            completed: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            pending: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
            failed: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
            cancelled: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700",
        };
        return styles[status] || styles.pending;
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-40 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading purchases...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            My Purchases
                        </h1>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            {orders.length} {orders.length === 1 ? 'order' : 'orders'} in your purchase history
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { id: "all", label: "All Orders" },
                        { id: "completed", label: "Completed" },
                        { id: "pending", label: "Pending" }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${filter === f.id
                                ? "bg-primary dark:bg-accent text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="card-surface py-20 text-center">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start building your collection today</p>
                        <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Explore Artworks
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="card-surface p-6">
                                {/* Order Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => {
                                        const artwork = item.artwork;
                                        // Determine media url and type
                                        const mediaUrl = artwork?.fileUrl ? (artwork.fileUrl.startsWith('http') ? artwork.fileUrl : `http://localhost:5000${artwork.fileUrl}`) : null;
                                        const previewUrl = artwork?.previewUrl ? (artwork.previewUrl.startsWith('http') ? artwork.previewUrl : `http://localhost:5000${artwork.previewUrl}`) : null;

                                        // Prefer preview, then file. 
                                        const displayUrl = previewUrl || mediaUrl || `https://picsum.photos/400/400?random=${idx}`;

                                        const ext = displayUrl.split('.').pop().toLowerCase().split('?')[0];
                                        const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext) || artwork?.category === 'Video';
                                        const isAudio = ['mp3', 'wav', 'mpeg'].includes(ext) || artwork?.category === 'Audio';

                                        return (
                                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                                {/* Thumbnail */}
                                                <Link
                                                    to={artwork ? `/artwork/${artwork._id}` : "#"}
                                                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center group"
                                                >
                                                    {(() => {
                                                        if (isVideo) {
                                                            return (
                                                                <video
                                                                    src={displayUrl}
                                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                                    muted
                                                                    onMouseOver={e => e.target.play().catch(() => { })}
                                                                    onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                                />
                                                            );
                                                        } else if (isAudio) {
                                                            return (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-primary">
                                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 10l12-3" />
                                                                    </svg>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <img
                                                                    src={displayUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                                />
                                                            );
                                                        }
                                                    })()}
                                                </Link>

                                                {/* Details */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.licenseType} License
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                                                <img
                                                                    src={artwork?.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork?.artist?.name}&background=random`}
                                                                    alt={artwork?.artist?.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">{artwork?.artist?.name || "Anonymous"}</span>
                                                        </div>
                                                        {order.paymentStatus === "completed" && (
                                                            <button
                                                                onClick={() => handleDownload(artwork?._id || item.artwork, item.title)}
                                                                disabled={downloading === (artwork?._id || item.artwork)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                {downloading === (artwork?._id || item.artwork) ? 'Downloading...' : 'Download'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
