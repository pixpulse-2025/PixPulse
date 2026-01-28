import { useEffect, useState, useRef } from "react";
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

    // Custom Player Logic
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveform, setWaveform] = useState([]);

    useEffect(() => {
        setWaveform([...Array(64)].map(() => Math.random() * 60 + 20));
    }, []);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(e => console.log("Play failed", e));
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        if (!duration) return;
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newTime = percentage * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
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
            const BASE_URL = "http://localhost:5000";
            // Prefer fileUrl for the actual download content
            let downloadUrl;

            if (artwork.fileUrl) {
                downloadUrl = `${BASE_URL}${artwork.fileUrl}`;
            } else if (artwork.previewUrl) {
                downloadUrl = `${BASE_URL}${artwork.previewUrl}`;
            } else {
                downloadUrl = `https://picsum.photos/1200/800?random=${artwork._id}`;
            }

            // Fetch the file and create a blob for download
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Determine extension
            let extension = 'jpg';
            // Use mime type from blob or fileFormat from artwork
            const mimeType = blob.type || artwork.fileFormat;

            if (mimeType) {
                const mimeMap = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'image/gif': 'gif',
                    'video/mp4': 'mp4',
                    'video/webm': 'webm',
                    'audio/mpeg': 'mp3',
                    'audio/wav': 'wav',
                    'application/pdf': 'pdf'
                };
                if (mimeMap[mimeType]) {
                    extension = mimeMap[mimeType];
                }
            } else {
                // Fallback to url extension
                const urlExt = downloadUrl.split('.').pop().split('?')[0].toLowerCase();
                if (urlExt && urlExt.length < 5) extension = urlExt;
            }

            // Create download link
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${artwork.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file. Please try again.');
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

    // Correctly distinguish between the media file (for playing) and the preview image (for display)
    const mediaUrl = artwork.fileUrl ? `${BASE_URL}${artwork.fileUrl}` : null;

    const isImageFile = (url, format) => {
        if (format?.startsWith('image/')) return true;
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase().split('?')[0];
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    };

    const hasValidPreview = artwork.previewUrl && !artwork.previewUrl.includes('default-preview');

    const coverUrl = hasValidPreview
        ? `${BASE_URL}${artwork.previewUrl}`
        : (mediaUrl && isImageFile(mediaUrl, artwork.fileFormat) ? mediaUrl : null);

    // Robust media type detection
    const getMediaType = () => {
        if (artwork.category === 'Video' || artwork.fileFormat?.startsWith('video')) return 'video';
        if (artwork.category === 'Audio' || artwork.fileFormat?.startsWith('audio')) return 'audio';

        // Fallback to extension check
        if (mediaUrl) {
            const ext = mediaUrl.split('.').pop().toLowerCase().split('?')[0];
            if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
            if (['mp3', 'wav', 'mpeg'].includes(ext)) return 'audio';
        }
        return 'image';
    };

    const mediaType = getMediaType();

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
                        {/* Image/Media Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`group relative rounded-3xl overflow-hidden bg-white/5 border border-text/5 ${mediaType === 'audio' ? 'aspect-[2/1] flex items-center justify-center' : 'aspect-[4/3]'}`}
                        >
                            {mediaType === 'video' ? (
                                <video
                                    src={mediaUrl}
                                    poster={coverUrl}
                                    controls
                                    preload="metadata"
                                    className="w-full h-full object-cover"
                                />
                            ) : mediaType === 'audio' ? (
                                <div className="relative w-full min-h-[500px] flex flex-col justify-end overflow-hidden bg-gray-900 rounded-3xl group">
                                    {/* Full Background Image */}
                                    {coverUrl ? (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={coverUrl}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-[20s] ease-in-out group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950">
                                            <svg className="w-32 h-32 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 10l12-3" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Main Content */}
                                    <div className="relative z-10 flex flex-col items-center w-full px-8 py-12 gap-8">

                                        <div className="text-center space-y-2">
                                            <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-xl">{artwork.title}</h3>
                                            <p className="text-lg text-white/80 font-medium drop-shadow-md">{artwork.artist?.name}</p>
                                        </div>

                                        {/* Custom Audio Player UI */}
                                        <div className="w-full max-w-lg mt-4 space-y-6">
                                            {/* Waveform Timeline */}
                                            <div
                                                className="flex items-center justify-center gap-[2px] h-12 cursor-pointer group/wave select-none"
                                                onClick={handleSeek}
                                            >
                                                {waveform.map((height, i) => {
                                                    const progress = (i / waveform.length) * 100;
                                                    const currentPercent = (currentTime / duration) * 100;
                                                    const isPlayed = currentPercent > progress;
                                                    const isCurrent = Math.abs(currentPercent - progress) < (100 / waveform.length);

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`w-[3px] rounded-full transition-all duration-150 ${isCurrent ? 'bg-yellow-400 h-10 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : isPlayed ? 'bg-white/90' : 'bg-white/30'}`}
                                                            style={{
                                                                height: isCurrent ? '100%' : `${Math.max(20, height)}%`
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>

                                            {/* Time Display */}
                                            <div className="text-center font-mono text-xl text-white tracking-widest drop-shadow-md">
                                                {formatTime(currentTime)} <span className="text-white/40 mx-2">/</span> {formatTime(duration || 0)}
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center justify-between max-w-sm mx-auto px-4 pb-4">
                                                {/* Share */}
                                                <button className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                                </button>

                                                {/* Rewind */}
                                                <button
                                                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
                                                    className="text-white hover:text-yellow-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                                >
                                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" /></svg>
                                                </button>

                                                {/* Play/Pause */}
                                                <button
                                                    onClick={togglePlay}
                                                    className="w-16 h-16 bg-white hover:bg-white/90 text-gray-900 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl"
                                                >
                                                    {isPlaying ? (
                                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                                                    ) : (
                                                        <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    )}
                                                </button>

                                                {/* Fast Forward */}
                                                <button
                                                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10); }}
                                                    className="text-white hover:text-yellow-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                                >
                                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" /></svg>
                                                </button>

                                                {/* Loop */}
                                                <button
                                                    className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full group/loop"
                                                    onClick={(e) => {
                                                        if (audioRef.current) {
                                                            audioRef.current.loop = !audioRef.current.loop;
                                                            e.currentTarget.classList.toggle('text-yellow-400');
                                                        }
                                                    }}
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                </button>
                                            </div>

                                            <audio
                                                ref={audioRef}
                                                src={mediaUrl}
                                                onTimeUpdate={handleTimeUpdate}
                                                onLoadedMetadata={handleLoadedMetadata}
                                                onEnded={() => setIsPlaying(false)}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Default Image
                                <>
                                    <img
                                        src={coverUrl}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                                        onClick={() => setShowPreview(true)}
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    />
                                </>
                            )}
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
                    <div className="relative max-w-7xl max-h-full flex items-center justify-center">
                        {(() => {
                            const ext = imageUrl.split('.').pop().toLowerCase().split('?')[0];
                            const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext) || artwork.category === 'Video';
                            const isAudio = ['mp3', 'wav', 'mpeg'].includes(ext) || artwork.category === 'Audio';

                            if (isVideo) {
                                return (
                                    <video
                                        controls
                                        autoPlay
                                        src={imageUrl}
                                        className="rounded-2xl shadow-2xl max-h-[90vh] w-auto max-w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                );
                            } else if (isAudio) {
                                return (
                                    <div className="bg-neutral-900 p-8 rounded-2xl flex flex-col items-center gap-4 min-w-[300px]" onClick={(e) => e.stopPropagation()}>
                                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 10l12-3" />
                                            </svg>
                                        </div>
                                        <audio controls src={imageUrl} className="w-full" />
                                        <p className="text-white font-bold">{artwork.title}</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <img
                                        src={imageUrl}
                                        alt={artwork.title}
                                        className="rounded-2xl shadow-2xl max-h-[90vh] w-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                );
                            }
                        })()}
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
