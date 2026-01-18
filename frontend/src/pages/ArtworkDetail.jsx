import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworkById } from "../redux/slices/artworkSlice";
import { addToFavorites, removeFromFavorites } from "../redux/slices/favoritesSlice";
import { addToCart as addToCartAction } from "../redux/slices/cartSlice";
import ReportArtworkModal from "../components/ReportArtworkModal";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const ArtworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { currentArtwork: artwork, loading, error } = useSelector((state) => state.artwork);
    const favorites = useSelector((state) => state.favorites.favorites);
    const cartItems = useSelector((state) => state.cart.items);
    const [showPreview, setShowPreview] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        dispatch(fetchArtworkById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (user && artwork) {
            const favorited = favorites.some(fav => (fav.artwork?._id || fav.artwork) === artwork._id);
            setIsFavorited(favorited);
        }
    }, [favorites, artwork, user]);

    useEffect(() => {
        if (user && artwork) {
            const inCart = cartItems.some(item => (item.artwork?._id || item.artwork) === artwork._id);
            setAddedToCart(inCart);
        }
    }, [cartItems, artwork, user]);

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

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/artwork/${id}` } } });
            return;
        }
        try {
            setIsAddingToCart(true);
            await dispatch(addToCartAction({
                artworkId: id,
                licenseType: artwork.licenseType
            })).unwrap();
            setAddedToCart(true);
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
            await dispatch(addToCartAction({
                artworkId: id,
                licenseType: artwork.licenseType
            })).unwrap();
            navigate("/cart");
        } catch (error) {
            alert(error || "Failed to process purchase");
            setIsBuyingNow(false);
        }
    };


    const handleDownload = async () => {
        try {
            // Use the SAME logic as the image display to get the correct URL
            const BASE_URL = "http://localhost:5000";
            let imageUrl;

            if (artwork.previewUrl || artwork.fileUrl) {
                imageUrl = `${BASE_URL}${artwork.previewUrl || artwork.fileUrl}`;
            } else {
                // Use placeholder if no image
                imageUrl = `https://picsum.photos/1200/800?random=${artwork._id}`;
            }

            // Fetch the image and create a blob for download
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Create download link
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${artwork.title.replace(/[^a-z0-9]/gi, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-text/60 font-medium">Loading artwork...</p>
                </div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-center px-6">
                <div className="space-y-8 max-w-md">
                    <div className="space-y-4">
                        <h2 className="text-6xl font-black uppercase tracking-tighter text-text/20">Not Found</h2>
                        <p className="text-text/60">This artwork doesn't exist or has been removed.</p>
                    </div>
                    <Link to="/explore" className="btn-primary inline-block">
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const BASE_URL = "http://localhost:5000";
    const imageUrl = artwork.previewUrl || artwork.fileUrl
        ? `${BASE_URL}${artwork.previewUrl || artwork.fileUrl}`
        : `https://picsum.photos/1200/800?random=${artwork._id}`;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-32 max-w-[1400px]">
                {/* Breadcrumb & Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 space-y-8"
                >
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text/40">
                        <Link to="/explore" className="hover:text-primary transition-colors">Explore</Link>
                        <span>/</span>
                        <span className="text-text/60">{artwork.category}</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text">
                            {artwork.title}
                        </h1>
                        <button
                            onClick={handleToggleFavorite}
                            className={`p-4 rounded-2xl transition-all ${isFavorited
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                : "bg-white/5 text-text border border-text/10 hover:border-text/30"
                                }`}
                        >
                            <svg className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-text/5 cursor-zoom-in aspect-[4/3]"
                            onClick={() => setShowPreview(true)}
                        >
                            <img
                                src={imageUrl}
                                alt={artwork.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Description */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-text">About</h3>
                                <p className="text-base text-text/70 leading-relaxed">
                                    {artwork.description || "A stunning piece of digital artwork."}
                                </p>
                                {artwork.tags && artwork.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {artwork.tags.map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-text">Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-text/5">
                                        <span className="text-xs font-bold uppercase tracking-widest text-text/40">License</span>
                                        <span className="text-sm font-bold text-text">{artwork.licenseType}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-text/5">
                                        <span className="text-xs font-bold uppercase tracking-widest text-text/40">Quality</span>
                                        <span className="text-sm font-bold text-text">High Resolution</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-text/5">
                                        <span className="text-xs font-bold uppercase tracking-widest text-text/40">Published</span>
                                        <span className="text-sm font-bold text-text">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8 card-surface p-8 rounded-3xl">
                            {/* Price */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-text/40">Price</p>
                                <h2 className="text-5xl font-black tracking-tighter text-text">
                                    ${artwork.price}
                                </h2>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {artwork.price === 0 ? (
                                    // Free artwork - show download button
                                    <button
                                        onClick={handleDownload}
                                        className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Free
                                    </button>
                                ) : (
                                    // Paid artwork - show buy/cart buttons
                                    <>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={isBuyingNow || isAddingToCart}
                                            className="btn-primary w-full py-4 text-base font-bold"
                                        >
                                            {isBuyingNow ? "Processing..." : "Buy Now"}
                                        </button>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isBuyingNow || isAddingToCart || addedToCart}
                                            className="btn-secondary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                                        >
                                            {addedToCart ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Added to Cart
                                                </>
                                            ) : isAddingToCart ? (
                                                "Adding..."
                                            ) : (
                                                "Add to Cart"
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Artist Info */}
                            <div className="pt-8 border-t border-text/10">
                                <Link to={`/profile/${artwork.artist?._id}`} className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-text/10 group-hover:scale-105 transition-transform">
                                        <img
                                            src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                            alt={artwork.artist?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-text/40 mb-1">Artist</p>
                                        <p className="text-lg font-bold text-text group-hover:text-primary transition-colors">{artwork.artist?.name}</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Report Button */}
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="w-full py-3 border border-text/10 text-text/60 hover:text-text hover:border-text/30 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                                Report Artwork
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                    onClick={() => setShowPreview(false)}
                >
                    <div className="relative max-w-7xl max-h-full">
                        <img src={imageUrl} alt={artwork.title} className="rounded-2xl shadow-2xl max-h-[90vh] w-auto" />
                        <button className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors text-sm font-medium">
                            Press ESC to close
                        </button>
                    </div>
                </div>
            )}

            <ReportArtworkModal
                artworkId={id}
                artworkTitle={artwork?.title}
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </div>
    );
};

export default ArtworkDetail;
