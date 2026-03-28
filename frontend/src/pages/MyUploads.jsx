import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchMyUploads,
    updateArtwork,
    toggleArtworkVisibility,
    deleteArtwork,
} from "../redux/slices/artworkSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyUploads = () => {
    const dispatch = useDispatch();
    const { myArtworks, loading, error } = useSelector((state) => state.artwork);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        dispatch(fetchMyUploads());
    }, [dispatch]);

    const handleEdit = (artwork) => {
        setEditingId(artwork._id);
        setEditForm({
            title: artwork.title,
            description: artwork.description,
            priceType: artwork.priceType,
            price: artwork.price,
            tags: artwork.tags.join(", "),
            licenseType: artwork.licenseType,
        });
    };

    const handleSaveEdit = async (id) => {
        await dispatch(updateArtwork({ id, data: editForm }));
        setEditingId(null);
    };

    const handleToggleVisibility = (id) => {
        dispatch(toggleArtworkVisibility(id));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this artwork?")) {
            dispatch(deleteArtwork(id));
        }
    };

    const handleDownload = async (artworkId, artworkTitle) => {
        try {
            setDownloading(artworkId);
            const response = await axios.get(`${API_URL}/download/${artworkId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const mimeType = response.headers['content-type'];
            let extension = 'jpg';

            if (mimeType) {
                const mimeMap = {
                    'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp',
                    'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
                    'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/ogg': 'ogg', 'application/pdf': 'pdf'
                };
                if (mimeMap[mimeType]) extension = mimeMap[mimeType];
            }

            const link = document.createElement('a');
            link.href = url;
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

    if (loading && myArtworks.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your uploads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </Link>
                            <h1 className="text-4xl font-bold text-white">My Uploads</h1>
                        </div>
                        <p className="text-gray-400">
                            Manage your creative portfolio ({myArtworks.length} {myArtworks.length === 1 ? 'item' : 'items'})
                        </p>
                    </div>
                    <Link
                        to="/upload"
                        className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Upload New
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {myArtworks.length === 0 ? (
                    <div className="card-surface rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No uploads yet</h3>
                        <p className="text-gray-400 mb-6">Start sharing your creative work with the world!</p>
                        <Link
                            to="/upload"
                            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            Upload Your First Artwork
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {myArtworks.map((artwork) => (
                            <div key={artwork._id} className="flex flex-col md:flex-row gap-4 p-4 card-surface rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                {/* Thumbnail */}
                                <div className="w-full md:w-32 md:h-32 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-white/5 relative group">
                                    <img
                                        src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        onError={(e) => {
                                            e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                        }}
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${artwork.isPublic ? "bg-green-500/80 text-white" : "bg-black/80 text-gray-300"}`}>
                                            {artwork.isPublic ? "Public" : "Hidden"}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {editingId === artwork._id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded bg-[#141821] border border-white/10 text-white text-sm"
                                                placeholder="Title"
                                            />
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded bg-[#141821] border border-white/10 text-white text-sm"
                                                rows="2"
                                                placeholder="Description"
                                            />
                                            <div className="flex gap-3">
                                                <select
                                                    value={editForm.priceType}
                                                    onChange={(e) => setEditForm({ ...editForm, priceType: e.target.value })}
                                                    className="w-32 px-3 py-1.5 rounded bg-[#141821] border border-white/10 text-white text-sm"
                                                >
                                                    <option value="Free">Free</option>
                                                    <option value="Paid">Paid</option>
                                                </select>
                                                {editForm.priceType === "Paid" && (
                                                    <input
                                                        type="number"
                                                        value={editForm.price}
                                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                        className="w-32 px-3 py-1.5 rounded bg-[#141821] border border-white/10 text-white text-sm"
                                                        placeholder="Price"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <button onClick={() => handleSaveEdit(artwork._id)} className="btn-primary flex items-center gap-1.5 px-4 py-1.5 text-sm h-8">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Save
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="px-4 py-1.5 bg-white/5 text-gray-300 rounded hover:bg-white/10 text-sm h-8 font-medium">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full justify-between gap-4 md:flex-row md:items-start">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-lg font-bold text-white mb-0.5 truncate" title={artwork.title}>
                                                    {artwork.title}
                                                </h3>
                                                <p className="text-sm text-[#8B5CF6] mb-2 truncate">
                                                    {artwork.category} • {artwork.subCategory}
                                                </p>
                                                <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-2">
                                                    {artwork.description || <span className="italic opacity-50">No description provided</span>}
                                                </p>
                                                
                                                <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        {artwork.views || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        {artwork.downloads || 0}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                    <span className={`${artwork.priceType === "Free" ? "text-green-400" : "text-emerald-400"}`}>
                                                        {artwork.priceType === "Free" ? "FREE" : `$${artwork.price?.toFixed(2) || '0.00'}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col gap-2 flex-shrink-0">
                                                <button onClick={() => handleDownload(artwork._id, artwork.title)} disabled={downloading === artwork._id} className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2 bg-[#141821] border border-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-500 hover:border-green-500/50 rounded-lg transition-all disabled:opacity-50" title="Download Original">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                </button>
                                                <button onClick={() => handleEdit(artwork)} className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2 bg-[#141821] border border-white/5 hover:bg-[#8B5CF6]/20 text-gray-400 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/50 rounded-lg transition-all" title="Edit Artwork">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleToggleVisibility(artwork._id)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 p-2 bg-[#141821] border border-white/5 transition-all rounded-lg ${artwork.isPublic ? 'hover:bg-amber-500/20 text-gray-400 hover:text-amber-500 hover:border-amber-500/50' : 'hover:bg-green-500/20 text-gray-400 hover:text-green-500 hover:border-green-500/50'}`} title={artwork.isPublic ? "Hide Artwork" : "Publish Artwork"}>
                                                    {artwork.isPublic ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                </button>
                                                <button onClick={() => handleDelete(artwork._id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2 bg-[#141821] border border-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 hover:border-red-500/50 rounded-lg transition-all" title="Delete Artwork">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
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

export default MyUploads;
