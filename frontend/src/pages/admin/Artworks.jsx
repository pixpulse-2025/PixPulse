import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminArtworks = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, paid, free, hidden
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchArtworks();
    }, []);

    const fetchArtworks = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/artworks`);
            setArtworks(data.artworks || data.data || []);
        } catch (error) {
            console.error("Error fetching artworks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async (artworkId, isPublic) => {
        if (!window.confirm(`Are you sure you want to ${isPublic ? 'hide' : 'show'} this artwork?`)) {
            return;
        }

        try {
            await axios.patch(`${API_URL}/artworks/${artworkId}`, {
                isPublic: !isPublic
            });

            setArtworks(artworks.map(a =>
                a._id === artworkId ? { ...a, isPublic: !isPublic } : a
            ));

            const message = isPublic ? 'Artwork hidden successfully' : 'Artwork shown successfully';
            alert(message);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update artwork');
        }
    };

    const handleDeleteArtwork = async (artworkId) => {
        if (!window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/artworks/${artworkId}`);
            setArtworks(artworks.filter(a => a._id !== artworkId));
            alert('Artwork deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete artwork');
        }
    };

    const handleViewArtwork = (artwork) => {
        setSelectedArtwork(artwork);
        setShowPreview(true);
    };

    // Filter artworks
    const filteredArtworks = artworks.filter(artwork => {
        // Search filter
        const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.artist?.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Type/status filter
        if (filter === "paid") return artwork.priceType === "Paid";
        if (filter === "free") return artwork.priceType === "Free";
        if (filter === "hidden") return !artwork.isPublic;
        return true; // all
    });

    // Statistics
    const stats = {
        total: artworks.length,
        paid: artworks.filter(a => a.priceType === "Paid").length,
        free: artworks.filter(a => a.priceType === "Free").length,
        hidden: artworks.filter(a => !a.isPublic).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading artworks...</p>
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
                            Artwork Management
                        </h1>
                        <p className="text-gray-400">
                            Manage artworks, visibility, and content
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Total Artworks</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Paid</p>
                        <p className="text-2xl font-bold text-green-500">{stats.paid}</p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Free</p>
                        <p className="text-2xl font-bold text-blue-500">{stats.free}</p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Hidden</p>
                        <p className="text-2xl font-bold text-red-500">{stats.hidden}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by title, description, or artist..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#0B0D10] text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent placeholder-gray-500"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            {["all", "paid", "free", "hidden"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                        ? "bg-[#8B5CF6] text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Artworks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArtworks.length > 0 ? (
                        filteredArtworks.map((artwork) => (
                            <div key={artwork._id} className="bg-[#141821] border border-white/5 rounded-2xl overflow-hidden group">
                                {/* Image */}
                                <div className="relative aspect-video bg-gray-900">
                                    <img
                                        src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                                        onClick={() => handleViewArtwork(artwork)}
                                        onError={(e) => {
                                            e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                        }}
                                    />

                                    {/* Status Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {artwork.priceType === "Free" ? (
                                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                                FREE
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                                ${artwork.price}
                                            </span>
                                        )}
                                        {!artwork.isPublic && (
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                                HIDDEN
                                            </span>
                                        )}
                                    </div>

                                    {/* Quick View Button */}
                                    <button
                                        onClick={() => handleViewArtwork(artwork)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium">
                                            👁️ View Details
                                        </span>
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-1 truncate">
                                        {artwork.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                        {artwork.description}
                                    </p>

                                    {/* Artist */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <img
                                            src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                            alt={artwork.artist?.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-xs text-gray-400">
                                            {artwork.artist?.name || "Unknown"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleVisibility(artwork._id, artwork.isPublic)}
                                            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${artwork.isPublic
                                                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                                : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                }`}
                                        >
                                            {artwork.isPublic ? "Hide" : "Show"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteArtwork(artwork._id)}
                                            className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 font-medium text-sm transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-[#141821] border border-white/5 rounded-2xl p-12 text-center">
                            <p className="text-gray-400">No artworks found</p>
                        </div>
                    )}
                </div>

                {/* Preview Modal */}
                {showPreview && selectedArtwork && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                        <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                            >
                                ✕
                            </button>

                            {/* Image */}
                            <div className="bg-gray-900 rounded-2xl overflow-hidden mb-4">
                                <img
                                    src={`http://localhost:5000${selectedArtwork.previewUrl || selectedArtwork.fileUrl}`}
                                    alt={selectedArtwork.title}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                    onError={(e) => {
                                        e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            {selectedArtwork.title}
                                        </h2>
                                        <p className="text-gray-400 mb-4">
                                            {selectedArtwork.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>📁 {selectedArtwork.category}</span>
                                            <span>💰 {selectedArtwork.priceType === "Free" ? "Free" : `$${selectedArtwork.price}`}</span>
                                            <span>📜 {selectedArtwork.licenseType}</span>
                                            <span>👁️ {selectedArtwork.views || 0} views</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/artwork/${selectedArtwork._id}`}
                                            target="_blank"
                                            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                                        >
                                            View on Site
                                        </Link>
                                    </div>
                                </div>

                                {/* Artist Info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <img
                                        src={selectedArtwork.artist?.avatar || `https://ui-avatars.com/api/?name=${selectedArtwork.artist?.name}&background=random`}
                                        alt={selectedArtwork.artist?.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-white">
                                            {selectedArtwork.artist?.name || "Unknown Artist"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {selectedArtwork.artist?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminArtworks;
