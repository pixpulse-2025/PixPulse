import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchArtworks,
    selectArtworks,
    selectArtworkLoading,
    selectArtworkPagination,
    setFilters,
    selectArtworkFilters
} from "../redux/slices/artworkSlice";
import ArtworkGrid from "../components/artwork/ArtworkGrid";
import DrawSearchModal from "../components/search/DrawSearchModal";
import HumSearchModal from "../components/search/HumSearchModal";

const AudioListRow = ({ artwork }) => {
    const BASE_URL = "http://localhost:5000";
    const mediaUrl = artwork.fileUrl ? `${BASE_URL}${artwork.fileUrl}` : null;
    const hasValidPreview = artwork.previewUrl && !artwork.previewUrl.includes('default-preview');
    const coverUrl = hasValidPreview ? `${BASE_URL}${artwork.previewUrl}` : null;
    const navigate = useNavigate();

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveform, setWaveform] = useState([]);

    useEffect(() => {
        // High density for thin bars
        setWaveform([...Array(160)].map(() => Math.max(10, Math.random() * 100)));
    }, []);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const togglePlay = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                document.querySelectorAll('audio').forEach(el => {
                    if (el !== audioRef.current) el.pause();
                });
                audioRef.current.play().catch(e => console.error("Play error:", e));
                setIsPlaying(true);
            }
        }
    };

    const handleSeek = (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onPause = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('play', onPlay);
        return () => {
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('play', onPlay);
        };
    }, []);

    return (
        <div
            className="flex items-center gap-6 p-4 bg-[#141821] rounded-2xl border border-white/5 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            onClick={() => navigate(`/artwork/${artwork._id}`)}
        >
            {/* Image with Play Overlay */}
            <div className="relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden shadow-md" onClick={togglePlay}>
                {coverUrl ? (
                    <img src={coverUrl} alt={artwork.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white">
                        <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 10l12-3" />
                        </svg>
                    </div>
                )}
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isPlaying ? (
                        <svg className="w-8 h-8 text-white fill-current drop-shadow-lg" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                    ) : (
                        <svg className="w-8 h-8 text-white fill-current drop-shadow-lg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </div>
            </div>

            {/* Content & Player */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white truncate hover:text-[#8B5CF6] transition-colors">
                        {artwork.title}
                    </h3>
                    <span className="bg-[#0B0D10] text-gray-300 px-2 py-1 rounded text-xs font-bold border border-white/5">
                        {artwork.price > 0 ? `$${artwork.price}` : 'Free'}
                    </span>
                </div>
                <div className="text-xs text-gray-400 -mt-1">{artwork.artist?.name || 'Unknown Artist'}</div>

                {/* Styled Waveform Player */}
                <div className="flex items-center gap-4 w-full mt-1">
                    <span className="font-mono text-xs font-medium text-gray-400 min-w-[32px]">
                        {formatTime(currentTime)}
                    </span>

                    <div
                        className="flex-1 flex items-center h-8 cursor-pointer select-none"
                        onClick={handleSeek}
                    >
                        {waveform.map((height, i) => {
                            const progress = (i / waveform.length) * 100;
                            const currentPercent = (currentTime / duration) * 100;
                            const isPlayed = currentPercent > progress;

                            return (
                                <div
                                    key={i}
                                    className="flex-1 flex justify-center h-full items-center"
                                >
                                    <div
                                        className={`w-[2px] rounded-full transition-colors duration-100 ${isPlayed ? 'bg-white' : 'bg-gray-600'}`}
                                        style={{
                                            height: `${height}%`,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={mediaUrl}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
        </div>
    );
};

const Explore = () => {
    const dispatch = useDispatch();
    const artworks = useSelector(selectArtworks);
    const loading = useSelector(selectArtworkLoading);
    const pagination = useSelector(selectArtworkPagination);
    const filters = useSelector(selectArtworkFilters);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [showDrawSearch, setShowDrawSearch] = useState(false);
    const [showHumSearch, setShowHumSearch] = useState(false);

    const handleAdvancedSearchResult = (result) => {
        setSearchTerm(result);
        setPage(1);
        dispatch(setFilters({ ...filters, search: result }));
    };
    const observer = useRef();

    const lastArtworkElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pagination.totalPages > page) {
                setPage(prevPageCount => prevPageCount + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, pagination.totalPages, page]);

    const categories = [
        // Removed "All Works"
        { id: "Visual Art", name: "Visual Art" },
        { id: "Audio", name: "Audio" },
        { id: "Video/Animation", name: "Video/Animation" },
        { id: "Presets/Resources", name: "Presets/Resources" },
        { id: "Other Creative Assets", name: "Other Assets" },
    ];

    const subCategories = {
        "Visual Art": [
            "Digital Paintings", "Illustrations", "Concept Art", "Photography",
            "3D Models", "Vector Art", "Pixel Art", "Abstract", "Anime/Manga",
            "Mixed Media", "Posters", "Wallpapers", "Motion Graphics"
        ],
        "Audio": ["Music tracks", "Beats", "Sound Effects", "Loops", "Voice Samples"],
        "Video/Animation": ["Short Animations", "Motion Templates", "VFX"],
        "Presets/Resources": ["Lightroom Presets", "Photoshop Brushes", "LUTs", "3D/Animation Presets"],
        "Other Creative Assets": ["Fonts", "Icons", "UI Kits", "Background Textures"]
    };

    const [selectedSubCategory, setSelectedSubCategory] = useState("all");

    useEffect(() => {
        dispatch(fetchArtworks({
            page,
            category: filters.category,
            subCategory: selectedSubCategory !== "all" ? selectedSubCategory : undefined,
            priceRange: filters.priceRange,
            sortBy: filters.sortBy,
            search: filters.search
        }));
    }, [dispatch, page, filters, selectedSubCategory]);

    const handleCategoryChange = (categoryId) => {
        dispatch(setFilters({ category: categoryId }));
        setSelectedSubCategory("all"); // Reset subcategory when main category changes
        setPage(1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchTerm }));
        setPage(1);
    };

    return (
        <div className="flex-grow bg-[#0B0D10] min-h-screen">
            <div className="pt-32 pb-10 px-6 bg-[#0B0D10] border-b border-white/5">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Explore Artworks
                            </h1>
                            <p className="text-base text-gray-400">
                                Discover amazing digital creations from talented artists
                            </p>
                        </div>

                        <form onSubmit={handleSearch} className="w-full max-w-lg">
                            {/* Search Bar */}
                            <div className="relative w-full max-w-xl mx-auto mb-12 transform hover:scale-[1.01] transition-transform duration-300 px-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search artworks, artists..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                        className="w-full pl-6 pr-40 py-4 rounded-full bg-[#141821] border border-white/10 shadow-lg focus:ring-2 focus:ring-[#8B5CF6]/50 text-white placeholder-gray-500 outline-none text-lg transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowDrawSearch(true)}
                                            className="p-2 text-gray-400 hover:text-[#8B5CF6] hover:bg-white/5 rounded-full transition-colors"
                                            title="Draw to Search"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowHumSearch(true)}
                                            className="p-2 text-gray-400 hover:text-[#8B5CF6] hover:bg-white/5 rounded-full transition-colors"
                                            title="Hum to Search"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                        </button>

                                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                                        <button
                                            type="submit"
                                            onClick={handleSearch}
                                            className="p-2.5 bg-[#8B5CF6] text-white rounded-full hover:bg-[#7C3AED] transition-all shadow-lg hover:shadow-violet-500/30 active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap ${filters.category === cat.id
                                        ? "bg-[#8B5CF6] text-white"
                                        : "bg-[#141821] text-gray-400 hover:bg-white/5 hover:text-white border border-white/10"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Subcategory Filter - Shows when a main category is selected */}
                        {filters.category !== "all" && subCategories[filters.category] && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                <span className="text-sm font-medium text-gray-400 whitespace-nowrap">Type:</span>
                                <button
                                    onClick={() => { setSelectedSubCategory("all"); setPage(1); }}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${selectedSubCategory === "all"
                                        ? "bg-white/10 text-white"
                                        : "bg-[#141821] text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    All
                                </button>
                                {subCategories[filters.category].map((subCat) => (
                                    <button
                                        key={subCat}
                                        onClick={() => { setSelectedSubCategory(subCat); setPage(1); }}
                                        className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${selectedSubCategory === subCat
                                            ? "bg-white/10 text-white"
                                            : "bg-[#141821] text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {subCat}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-400">Sort by:</span>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
                                className="bg-[#141821] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                            >
                                <option value="popular">Popular</option>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="most-viewed">Most Viewed</option>
                                <option value="most-downloaded">Most Downloaded</option>
                                <option value="rating">Highest Rated</option>
                            </select>

                            <span className="text-sm font-medium text-gray-400">Price:</span>
                            <select
                                value={filters.priceRange || 'all'}
                                onChange={(e) => dispatch(setFilters({ priceRange: e.target.value }))}
                                className="bg-[#141821] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                            >
                                <option value="all">All Prices</option>
                                <option value="free">Free</option>
                                <option value="under-10">Under $10</option>
                                <option value="10-50">$10 - $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="over-100">Over $100</option>
                            </select>

                            <span className="text-sm font-medium text-gray-400">Rating:</span>
                            <select
                                className="bg-[#141821] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">⭐⭐⭐⭐⭐ Only</option>
                                <option value="4">⭐⭐⭐⭐ & Up</option>
                                <option value="3">⭐⭐⭐ & Up</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div >

            <div className="container mx-auto max-w-[1400px] px-6 py-12">
                {filters.category === 'Audio' ? (
                    <div className="flex flex-col gap-4">
                        {artworks.length > 0 ? (
                            artworks.map(artwork => (
                                <AudioListRow key={artwork._id} artwork={artwork} />
                            ))
                        ) : !loading && (
                            <p className="text-center text-gray-500 py-10">No audio tracks found.</p>
                        )}
                    </div>
                ) : (
                    <ArtworkGrid artworks={artworks} loading={loading && page === 1} />
                )}

                <div ref={lastArtworkElementRef} className="h-20 flex justify-center items-center mt-12">
                    {loading && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    )}
                </div>
            </div>
            <DrawSearchModal isOpen={showDrawSearch} onClose={() => setShowDrawSearch(false)} onSearch={handleAdvancedSearchResult} />
            <HumSearchModal isOpen={showHumSearch} onClose={() => setShowHumSearch(false)} onSearch={handleAdvancedSearchResult} />
        </div >
    );
};

export default Explore;
