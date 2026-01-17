import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworkById } from "../redux/slices/artworkSlice";
import { addToFavorites, removeFromFavorites } from "../redux/slices/favoritesSlice";
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
        if (user && artwork) {
            const favorited = favorites.some(fav => (fav.artwork?._id || fav.artwork) === artwork._id);
            setIsFavorited(favorited);
        }
    }, [favorites, artwork, user]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-40 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-text/40 font-black uppercase tracking-widest text-xs">Loading Artwork...</p>
                </div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="min-h-screen bg-background pt-40 flex items-center justify-center text-center">
                <div className="space-y-8">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-text/10">Not Found</h2>
                    <Link to="/explore" className="inline-block px-12 py-5 bg-text text-background font-black uppercase tracking-widest rounded-full shadow-2xl">
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:5000${artwork.imageUrl}`) : `https://picsum.photos/1200/800?random=${artwork._id}`;

    return (
        <div className="min-h-screen bg-background pt-40 pb-40">
            <div className="container mx-auto px-6 max-w-[1600px]">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
                    <div className="space-y-6 max-w-4xl">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text/30">
                            <Link to="/explore" className="hover:text-text transition-colors">Works</Link>
                            <span>/</span>
                            <span className="text-text">{artwork.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-text leading-none">
                            {artwork.title}
                        </h1>
                    </div>
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-8 rounded-full transition-all active:scale-90 border-2 ${isFavorited
                            ? "bg-text text-background border-text shadow-2xl"
                            : "bg-transparent text-text border-text/10 hover:border-text"
                            }`}
                    >
                        <svg className="w-8 h-8" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    {/* Visual Asset */}
                    <div className="lg:col-span-8 space-y-20">
                        <div className="group relative rounded-[2rem] overflow-hidden bg-text/5 border border-text/5 cursor-zoom-in" onClick={() => setShowPreview(true)}>
                            <img
                                src={imageUrl}
                                alt={artwork.title}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        {/* Metadata Rows */}
                        <div className="grid md:grid-cols-2 gap-24 pt-20 border-t-4 border-text">
                            <div className="space-y-12">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-text">Overview</h3>
                                <p className="text-xl text-text/60 leading-relaxed font-medium tracking-tight">
                                    {artwork.description || "A beautiful piece of digital art exploration."}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {artwork.tags?.map(tag => (
                                        <span key={tag} className="px-5 py-2 bg-text border border-text text-background rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-12">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-text">Specifications</h3>
                                <div className="space-y-8">
                                    <div className="flex justify-between border-b border-text/5 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text/30">License</span>
                                        <span className="text-sm font-black uppercase tracking-tight">{artwork.licenseType}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-text/5 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text/30">Quality</span>
                                        <span className="text-sm font-black uppercase tracking-tight">Ultra High Res</span>
                                    </div>
                                    <div className="flex justify-between border-b border-text/5 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text/30">Published</span>
                                        <span className="text-sm font-black uppercase tracking-tight">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Commercial Access */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-40 space-y-12 bg-text text-background p-12 rounded-[2rem] shadow-2xl">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Price</p>
                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                                    ${artwork.price}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isBuyingNow || isAddingToCart}
                                    className="w-full py-8 bg-background text-text font-black uppercase tracking-widest rounded-2xl hover:opacity-80 transition-all active:scale-95 shadow-xl"
                                >
                                    {isBuyingNow ? "Processing..." : "Buy Now"}
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isBuyingNow || isAddingToCart}
                                    className="w-full py-8 border-2 border-background/20 text-background font-black uppercase tracking-widest rounded-2xl hover:bg-background/10 transition-all"
                                >
                                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                                </button>
                            </div>

                            <div className="pt-12 border-t border-background/10">
                                <Link to={`/profile/${artwork.artist?._id}`} className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background/10 group-hover:scale-105 transition-transform grayscale">
                                        <img
                                            src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                            alt={artwork.artist?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Artist</p>
                                        <p className="text-2xl font-black uppercase tracking-tighter group-hover:text-background/60 transition-colors">{artwork.artist?.name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expansive Overlay */}
            {showPreview && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[100] flex items-center justify-center p-12" onClick={() => setShowPreview(false)}>
                    <div className="relative max-w-full max-h-full">
                        <img src={imageUrl} alt={artwork.title} className="rounded-2xl shadow-2xl scale-100" />
                        <button className="absolute -top-16 right-0 text-text p-4 hover:opacity-40 transition-all">
                            <span className="text-xs font-black uppercase tracking-widest">Close [Esc]</span>
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
