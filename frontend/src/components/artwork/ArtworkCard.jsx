import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, selectIsFavorite, selectFavorites } from "../../redux/slices/favoritesSlice";
import { useAuth } from "../../hooks/useAuth";

const ArtworkCard = ({ artwork }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            className="group relative rounded-2xl overflow-hidden bg-[#141821] border border-white/5 shadow-lg transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div onClick={() => navigate(`/artwork/${artwork._id}`)} className="block relative aspect-[4/3] bg-[#0B0D10] overflow-hidden cursor-pointer">
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
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                            return (
                                <video
                                    ref={videoRef}
                                    src={mediaUrl}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            );
                        }
                    } else if (isAudio) {
                        return (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#141821] text-white p-4 relative overflow-hidden group/audio">
                                {coverUrl ? (
                                    <>
                                        <img
                                            src={coverUrl}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125 transition-transform duration-700 group-hover:scale-150"
                                        />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-[#0B0D10]" />
                                )}

                                <audio ref={audioRef} src={mediaUrl} onEnded={handleAudioEnded} />

                                <div className="relative z-20 flex flex-col items-center gap-4">
                                    <button
                                        onClick={toggleAudio}
                                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:bg-violet-500 hover:border-violet-400 transition-all duration-300 shadow-xl"
                                    >
                                        {isAudioPlaying ? (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-1 opacity-50 p-4 z-10 pointer-events-none">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`w-2 bg-violet-400 rounded-t-sm shadow-[0_0_10px_rgba(139,92,246,0.5)] ${isAudioPlaying ? 'animate-pulse' : ''}`} style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <img
                                src={coverUrl || `https://picsum.photos/800/600?random=${artwork._id || Math.random()}`}
                                alt={artwork.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        );
                    }
                })()}

                {/* Compact Info Panel on Hover */}
                <div className="absolute bottom-0 inset-x-0 px-3 py-2.5 bg-[#0B0D10]/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-30">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-white line-clamp-1 pr-2">{artwork.title}</h3>
                        <span className="text-sm font-bold text-[#A78BFA] whitespace-nowrap">${artwork.price || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400 line-clamp-1">{artwork.artist?.name || 'Anonymous'}</span>
                        <button
                            onClick={handleFavorite}
                            className={`transition-all duration-300 ${isFavorite ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}
                        >
                            <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkCard;
