import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworkById } from "../redux/slices/artworkSlice";
import { addToFavorites, removeFromFavorites, checkFavorite } from "../redux/slices/favoritesSlice";
import { addToCart as addToCartAction } from "../redux/slices/cartSlice";
import ReportArtworkModal from "../components/ReportArtworkModal";
import { useAuth } from "../hooks/useAuth";

const ArtworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { currentArtwork: artwork, loading, error } = useSelector((state) => state.artwork);
    const favorites = useSelector((state) => state.favorites.favorites);
    const [showPreview, setShowPreview] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    useEffect(() => {
        dispatch(fetchArtworkById(id));
    }, [dispatch, id]);

    useEffect(() => {
        // Check if artwork is in favorites
        if (user && artwork) {
            const favorited = favorites.some(fav => fav.artwork?._id === artwork._id);
            setIsFavorited(favorited);
        }
    }, [favorites, artwork, user]);

    // Close preview modal with ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showPreview) {
                setShowPreview(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showPreview]);

    const handleToggleFavorite = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/artwork/${id}` } } });
            return;
        }

        if (isFavorited) {
            await dispatch(removeFromFavorites(id));
            setIsFavorited(false);
        } else {
            await dispatch(addToFavorites(id));
            setIsFavorited(true);
        }
    };

    const handleDownload = () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/artwork/${id}` } } });
            return;
        }
        // TODO: Implement download logic
        alert("Download functionality coming soon!");
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/artwork/${id}` } } });
            return;
        }

        try {
            setIsAddingToCart(true);

            // Add to cart
            await dispatch(addToCartAction({
                artworkId: id,
                licenseType: artwork.licenseType
            })).unwrap();

            // Auto-add to favorites if not already favorited
            if (!isFavorited) {
                try {
                    await dispatch(addToFavorites(id));
                    setIsFavorited(true);
                } catch (favError) {
                    // Silently fail if favorite add fails
                    console.log("Could not add to favorites:", favError);
                }
            }

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in';
            successDiv.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>✓</span>
                    <div>
                        <p class="font-bold">Added to cart!</p>
                        ${!isFavorited ? '<p class="text-xs opacity-90">Also added to favorites ❤️</p>' : ''}
                    </div>
                </div>
            `;
            document.body.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        } catch (error) {
            alert(error || "Failed to add to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/artwork/${id}` } } });
            return;
        }

        try {
            setIsBuyingNow(true);
            // Add to cart
            await dispatch(addToCartAction({
                artworkId: id,
                licenseType: artwork.licenseType
            })).unwrap();

            // Redirect to cart/checkout
            navigate("/cart");
        } catch (error) {
            alert(error || "Failed to process purchase");
            setIsBuyingNow(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading artwork...</p>
                </div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="glass rounded-3xl p-12 text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Artwork Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "This artwork doesn't exist or has been removed."}</p>
                    <Link
                        to="/marketplace"
                        className="inline-block px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                    >
                        Back to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/marketplace" className="hover:text-primary-600">Marketplace</Link>
                    <span>/</span>
                    <Link to={`/marketplace?category=${artwork.category}`} className="hover:text-primary-600">{artwork.category}</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{artwork.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Image/Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Preview Image */}
                        <div className="glass rounded-3xl overflow-hidden group">
                            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                                <img
                                    src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                    alt={artwork.title}
                                    className="max-w-full max-h-full object-contain cursor-pointer transition-transform group-hover:scale-105"
                                    onClick={() => setShowPreview(true)}
                                    onError={(e) => {
                                        e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                    }}
                                />

                                {/* Watermark Overlay for Paid Items */}
                                {artwork.priceType === "Paid" && (
                                    <>
                                        {/* Diagonal Watermark */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                            <div className="text-white/20 text-6xl md:text-8xl font-bold transform -rotate-45 select-none">
                                                PREVIEW
                                            </div>
                                        </div>

                                        {/* Bottom Info Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                            <div className="flex items-center justify-between text-white">
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">🔒 Premium Content</p>
                                                    <p className="font-bold">Purchase to unlock full resolution</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowPreview(true);
                                                    }}
                                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all"
                                                >
                                                    👁️ View Preview
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Free Content Badge */}
                                {artwork.priceType === "Free" && (
                                    <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg">
                                        ✓ FREE
                                    </div>
                                )}

                                {/* Click to Enlarge Hint */}
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    🔍 Click to enlarge
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="glass rounded-3xl p-8">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{artwork.title}</h1>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    👁️ <span className="font-medium">{artwork.views || 0}</span> views
                                </span>
                                <span className="flex items-center gap-2">
                                    ❤️ <span className="font-medium">{artwork.likes?.length || 0}</span> likes
                                </span>
                                <span className="flex items-center gap-2">
                                    📥 <span className="font-medium">{artwork.downloads || 0}</span> downloads
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{artwork.description}</p>
                            </div>

                            {/* Tags */}
                            {artwork.tags && artwork.tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {artwork.tags.map((tag, idx) => (
                                            <Link
                                                key={idx}
                                                to={`/marketplace?search=${tag}`}
                                                className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{artwork.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sub-Category</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{artwork.subCategory}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">License</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{artwork.licenseType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">File Size</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {artwork.fileSize ? `${(artwork.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="glass rounded-3xl p-6 sticky top-24">
                            <div className="mb-6">
                                {artwork.priceType === "Free" ? (
                                    <div className="text-center">
                                        <span className="inline-block px-6 py-3 bg-green-500 text-white text-2xl font-bold rounded-2xl mb-2">
                                            FREE
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Download at no cost</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                            ${artwork.price}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{artwork.licenseType} License</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {artwork.priceType === "Free" ? (
                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        📥 Download Now
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart || isBuyingNow}
                                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isAddingToCart ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>🛒 Add to Cart</>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={isAddingToCart || isBuyingNow}
                                            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isBuyingNow ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>⚡ Buy Now</>
                                            )}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isAddingToCart || isBuyingNow}
                                    className={`w-full py-4 border-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {isFavorited ? "❤️" : "🤍"} {isFavorited ? "Favorited" : "Add to Favorites"}
                                </button>
                            </div>

                            {/* Artist Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Created by</p>
                                <Link
                                    to={`/artist/${artwork.artist?._id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <img
                                        src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                        alt={artwork.artist?.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white">{artwork.artist?.name || "Anonymous"}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{artwork.artist?.role || "Creator"}</p>
                                    </div>
                                </Link>

                                {/* Report Button */}
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="w-full mt-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    🚩 Report Artwork
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            <ReportArtworkModal
                artworkId={id}
                artworkTitle={artwork?.title}
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />

            {/* Enhanced Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                    <div className="relative max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-14 right-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                            title="Close (Esc)"
                        >
                            ✕
                        </button>

                        {/* Image Container */}
                        <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                            <img
                                src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                alt={artwork.title}
                                className="w-full h-auto max-h-[80vh] object-contain"
                                onError={(e) => {
                                    e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                }}
                            />

                            {/* Watermark for Paid Content */}
                            {artwork.priceType === "Paid" && (
                                <>
                                    {/* Diagonal Watermark */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="text-white/15 text-9xl font-bold transform -rotate-45 select-none">
                                            PREVIEW
                                        </div>
                                    </div>

                                    {/* Corner Watermarks */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                                        🔒 Preview Only
                                    </div>
                                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                                        Watermarked
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Info Bar */}
                        <div className="mt-4 glass rounded-2xl p-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="text-white">
                                    <h3 className="font-bold text-lg mb-1">{artwork.title}</h3>
                                    <p className="text-sm opacity-80">
                                        {artwork.priceType === "Paid"
                                            ? "Preview Mode - Purchase to unlock full resolution"
                                            : "Full Resolution Preview"}
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                {artwork.priceType === "Paid" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowPreview(false);
                                                handleAddToCart();
                                            }}
                                            disabled={isAddingToCart}
                                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all disabled:opacity-50"
                                        >
                                            🛒 Add to Cart
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPreview(false);
                                                handleBuyNow();
                                            }}
                                            disabled={isBuyingNow}
                                            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-all disabled:opacity-50"
                                        >
                                            ⚡ Buy Now - ${artwork.price}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Keyboard Hint */}
                        <p className="text-center text-white/60 text-xs mt-3">
                            Press ESC to close
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtworkDetail;
