import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchMyUploads,
    updateArtwork,
    toggleArtworkVisibility,
    deleteArtwork,
} from "../redux/slices/artworkSlice";

const MyUploads = () => {
    const dispatch = useDispatch();
    const { myArtworks, loading, error } = useSelector((state) => state.artwork);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

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
                            <div key={artwork._id} className="card-surface rounded-2xl overflow-hidden">
                                <div className="md:flex">
                                    {/* Preview Image */}
                                    <div className="md:w-64 h-48 md:h-auto bg-[#141821] border-r border-white/5 flex-shrink-0">
                                        <img
                                            src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                            alt={artwork.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        {editingId === artwork._id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#141821] text-white"
                                                    placeholder="Title"
                                                />
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#141821] text-white"
                                                    rows="3"
                                                    placeholder="Description"
                                                />
                                                <div className="flex gap-4">
                                                    <select
                                                        value={editForm.priceType}
                                                        onChange={(e) => setEditForm({ ...editForm, priceType: e.target.value })}
                                                        className="px-4 py-2 rounded-lg border border-white/10 bg-[#141821] text-white"
                                                    >
                                                        <option value="Free">Free</option>
                                                        <option value="Paid">Paid</option>
                                                    </select>
                                                    {editForm.priceType === "Paid" && (
                                                        <input
                                                            type="number"
                                                            value={editForm.price}
                                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                            className="px-4 py-2 rounded-lg border border-white/10 bg-[#141821] text-white"
                                                            placeholder="Price"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(artwork._id)}
                                                        className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-white mb-1">
                                                            {artwork.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mb-2">
                                                            {artwork.category} • {artwork.subCategory}
                                                        </p>
                                                        <p className="text-gray-300 mb-3">
                                                            {artwork.description}
                                                        </p>
                                                        {artwork.tags && artwork.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {artwork.tags.map((tag, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${artwork.isPublic
                                                                ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                                                                }`}
                                                        >
                                                            {artwork.isPublic ? "Public" : "Hidden"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-6 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            👁️ {artwork.views || 0} views
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            📥 {artwork.downloads || 0} downloads
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            {artwork.priceType === "Free" ? (
                                                                <span className="text-green-600 font-bold">FREE</span>
                                                            ) : (
                                                                <span className="text-primary-600 font-bold">${artwork.price}</span>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(artwork)}
                                                            className="px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleVisibility(artwork._id)}
                                                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            {artwork.isPublic ? "👁️ Hide" : "👁️‍🗨️ Unhide"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(artwork._id)}
                                                            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
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
