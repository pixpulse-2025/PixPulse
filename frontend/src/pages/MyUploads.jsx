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
    const { artworks, loading, error } = useSelector((state) => state.artwork);
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

    if (loading && artworks.length === 0) {
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Uploads</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage your creative portfolio ({artworks.length} {artworks.length === 1 ? 'item' : 'items'})
                        </p>
                    </div>
                    <Link
                        to="/upload"
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        + Upload New
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {artworks.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No uploads yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Start sharing your creative work with the world!</p>
                        <Link
                            to="/upload"
                            className="inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                        >
                            Upload Your First Artwork
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {artworks.map((artwork) => (
                            <div key={artwork._id} className="glass rounded-2xl overflow-hidden">
                                <div className="md:flex">
                                    {/* Preview Image */}
                                    <div className="md:w-64 h-48 md:h-auto bg-gray-200 dark:bg-gray-800 flex-shrink-0">
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
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    placeholder="Title"
                                                />
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    rows="3"
                                                    placeholder="Description"
                                                />
                                                <div className="flex gap-4">
                                                    <select
                                                        value={editForm.priceType}
                                                        onChange={(e) => setEditForm({ ...editForm, priceType: e.target.value })}
                                                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                                    >
                                                        <option value="Free">Free</option>
                                                        <option value="Paid">Paid</option>
                                                    </select>
                                                    {editForm.priceType === "Paid" && (
                                                        <input
                                                            type="number"
                                                            value={editForm.price}
                                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                                            placeholder="Price"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(artwork._id)}
                                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                            {artwork.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            {artwork.category} • {artwork.subCategory}
                                                        </p>
                                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
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
                                                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
                                                            className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleVisibility(artwork._id)}
                                                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                        >
                                                            {artwork.isPublic ? "👁️ Hide" : "👁️‍🗨️ Unhide"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(artwork._id)}
                                                            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
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
