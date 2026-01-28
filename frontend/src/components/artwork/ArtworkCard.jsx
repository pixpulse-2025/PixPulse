import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, selectIsFavorite, selectFavorites } from "../../redux/slices/favoritesSlice";
import { useAuth } from "../../hooks/useAuth";

const ArtworkCard = ({ artwork }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const isFavorite = useSelector(state => selectIsFavorite(state, artwork._id));
    const favorites = useSelector(selectFavorites);
    const videoRef = React.useRef(null);
    const audioRef = React.useRef(null);
    const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

    // Get favorite count for this artwork
    const favoriteCount = favorites.filter(fav =>
        (fav.artwork?._id || fav.artwork) === artwork._id
    ).length || artwork.favoriteCount || 0;

    const BASE_URL = "http://localhost:5000";
    // For playback/source
    const mediaUrl = artwork.fileUrl ? `${BASE_URL}${artwork.fileUrl}` : null;

    // Helper to check if file is image based on extension/format
    const isImageFile = (url, format) => {
        if (format?.startsWith('image/')) return true;
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase().split('?')[0];
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    };

    // For display/poster
    // 1. Explicit preview URL (only if real, not the backend default placeholder)
    // 2. File URL if it's an image
    // 3. Fallback placeholder
    const hasValidPreview = artwork.previewUrl && !artwork.previewUrl.includes('default-preview');

    const coverUrl = hasValidPreview
        ? `${BASE_URL}${artwork.previewUrl}`
        : (mediaUrl && isImageFile(mediaUrl, artwork.fileFormat)
            ? mediaUrl
            : null);

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            dispatch(toggleFavorite(artwork._id));
        }
    };

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const toggleAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (audioRef.current) {
            if (isAudioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsAudioPlaying(!isAudioPlaying);
        }
    };

    const handleAudioEnded = () => {
        setIsAudioPlaying(false);
    };

    return (
        <div
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link to={`/artwork/${artwork._id}`} className="block relative aspect-[3/4] bg-gray-900">
                {(() => {
                    const ext = (mediaUrl || coverUrl || '').split('.').pop().toLowerCase().split('?')[0];
                    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext) || artwork.category === 'Video';
                    const isAudio = ['mp3', 'wav', 'mpeg'].includes(ext) || artwork.category === 'Audio';

                    if (isVideo) {
                        if (coverUrl) {
                            return (
                                <>
                                    <img
                                        src={coverUrl}
                                        alt={artwork.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <video
                                        ref={videoRef}
                                        src={mediaUrl}
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />
                                </>
                            );
                        } else {
                            // No cover image? interactions (hover) will play the video, default shows first frame
                            return (
                                <video
                                    ref={videoRef}
                                    src={mediaUrl}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            );
                        }
                    } else if (isAudio) {
                        return (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4 relative overflow-hidden">
                                {/* Audio Cover Background */}
                                {coverUrl && (
                                    <>
                                        <img
                                            src={coverUrl}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-60 scale-110 transition-transform duration-700 group-hover:scale-125"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                                    </>
                                )}

                                <audio ref={audioRef} src={mediaUrl} onEnded={handleAudioEnded} />

                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 relative z-20 group/audio hover:scale-105 transition-transform duration-300">
                                    {/* Center Art (Mini) if we want? Or just play button. I'll stick to play button cleanly centered */}
                                    <button
                                        onClick={toggleAudio}
                                        className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-white/20"
                                    >
                                        {isAudioPlaying ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <span className="relative z-20 text-sm font-medium opacity-90 line-clamp-1 drop-shadow-md">{artwork.title}</span>

                                {/* Visualizer decorative elements */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end justify-center gap-1 opacity-40 p-4 z-10">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 bg-white rounded-t-sm transition-all duration-300 ${isAudioPlaying ? 'animate-pulse' : ''}`}
                                            style={{
                                                height: `${Math.random() * 80 + 20}%`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <img
                                src={coverUrl || `https://picsum.photos/800/600?random=${artwork._id || Math.random()}`}
                                alt={artwork.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        );
                    }
                })()}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    {/* Top: Heart Icon with Count */}
                    <div className="flex items-start justify-end pointer-events-auto">
                        <button
                            onClick={handleFavorite}
                            className={`h-10 px-3 rounded-full backdrop-blur-sm border flex items-center gap-2 transition-all ${isFavorite
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                                }`}
                        >
                            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm font-semibold">{favoriteCount}</span>
                        </button>
                    </div>

                    {/* Bottom: Creator Info & Price */}
                    <div className="flex items-end justify-between pointer-events-auto">
                        <Link
                            to={`/profile/${artwork.artist?._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                <img
                                    src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name || 'Artist'}&background=random`}
                                    alt={artwork.artist?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {artwork.artist?.name || 'Anonymous'}
                            </span>
                        </Link>

                        {/* Price */}
                        <div className="px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <span className="text-sm font-bold text-white">
                                ${artwork.price || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ArtworkCard;
