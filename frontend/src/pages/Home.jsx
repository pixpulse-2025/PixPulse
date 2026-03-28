import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { fetchArtworks, selectArtworks, selectArtworkLoading } from "../redux/slices/artworkSlice";
import { motion, useScroll, useTransform } from "framer-motion";
import ArtworkCard from "../components/artwork/ArtworkCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── AudioWaveCard ─────────────────────────────────────────────────────────────
// A premium audio card with animated waveform bars, play/pause, and progress.
const AudioWaveCard = ({ artwork, apiUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveform] = useState(() => [...Array(160)].map(() => Math.random() * 60 + 25));

    const BASE = apiUrl.replace("/api", "");
    const fileUrl = artwork.fileUrl
        ? (artwork.fileUrl.startsWith("http") ? artwork.fileUrl : `${BASE}${artwork.fileUrl}`)
        : null;
    const coverUrl = artwork.previewUrl
        ? (artwork.previewUrl.startsWith("http") ? artwork.previewUrl : `${BASE}${artwork.previewUrl}`)
        : artwork.coverUrl
            ? (artwork.coverUrl.startsWith("http") ? artwork.coverUrl : `${BASE}${artwork.coverUrl}`)
            : null;

    const formatTime = (t) => {
        if (!t || isNaN(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

    const togglePlay = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!audioRef.current || !fileUrl) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [isPlaying, fileUrl]);

    const handleSeek = (e) => {
        if (!duration || !audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        audioRef.current.currentTime = pct * duration;
        setCurrentTime(pct * duration);
    };

    const progressPct = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="group relative flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#141821] border border-white/10 hover:border-white/5 transition-all duration-300 hover:bg-[#1a1f2e]">
            {/* Cover Art + Play Button */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex-shrink-0">
                {coverUrl ? (
                    <img src={coverUrl} alt={artwork.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 10l12-3" />
                        </svg>
                    </div>
                )}
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>
            </div>

            {/* Title & Artist */}
            <div className="min-w-0 w-36 md:w-44 flex-shrink-0">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors leading-tight">
                    {artwork.title}
                </h3>
                {artwork.artist?._id ? (
                    <Link
                        to={`/artist/${artwork.artist._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors truncate leading-tight mt-0.5 block"
                    >
                        {artwork.artist.name}
                    </Link>
                ) : (
                    <p className="text-xs text-cyan-400/60 truncate leading-tight mt-0.5">
                        {artwork.artist?.name || "Unknown Artist"}
                    </p>
                )}
            </div>

            {/* Waveform + Time */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
                {/* Waveform */}
                <div
                    className="flex-1 flex items-end gap-[1px] h-10 cursor-pointer select-none"
                    onClick={handleSeek}
                >
                    {waveform.map((h, i) => {
                        const barPct = (i / waveform.length) * 100;
                        const isPlayed = progressPct > barPct;
                        const isCurrent = Math.abs(progressPct - barPct) < (100 / waveform.length);
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-100 ${isCurrent
                                    ? 'bg-[#C8ACD6] shadow-[0_0_6px_rgba(139,92,246,0.5)]'
                                    : isPlayed
                                        ? 'bg-[#433D8B]/80'
                                        : 'bg-white/12 group-hover:bg-white/20'
                                    }`}
                                style={{
                                    height: isCurrent ? '100%' : `${Math.max(18, h)}%`,
                                    maxWidth: '3px',
                                    minWidth: '1.5px',
                                }}
                            />
                        );
                    })}
                </div>
                {/* Time */}
                <span className="text-[10px] font-mono text-cyan-400/60 flex-shrink-0 w-16 text-right tabular-nums">
                    {formatTime(currentTime)}/{formatTime(duration)}
                </span>
            </div>

            {/* Price & Action */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <span className={`text-sm font-bold ${artwork.price > 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {artwork.price > 0 ? `$${artwork.price}` : 'Free'}
                </span>
                <Link
                    to={`/artwork/${artwork._id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-xs font-semibold border border-white/10 hover:border-white/30"
                >
                    View
                </Link>
            </div>

            {/* Hidden audio element */}
            {fileUrl && (
                <audio
                    ref={audioRef}
                    src={fileUrl}
                    preload="metadata"
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={() => setIsPlaying(false)}
                />
            )}
        </div>
    );
};

const Home = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const artworks = useSelector(selectArtworks);
    const loading = useSelector(selectArtworkLoading);
    const { scrollYProgress } = useScroll();

    // Parallax background effect (subtle vertical shift)
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const [featuredArtists, setFeaturedArtists] = useState([]);
    const [subscribeEmail, setSubscribeEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState(""); // "", "success", "error"

    useEffect(() => {
        dispatch(fetchArtworks({ limit: 20, sortBy: "popular" }));
        fetchTopCreators();
    }, [dispatch]);

    const fetchTopCreators = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/users/top-creators`);
            if (data.success) {
                setFeaturedArtists(data.data.map(artist => ({
                    name: artist.name,
                    totalViews: artist.totalViews || 0,
                    img: artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&background=random`,
                    id: artist._id
                })));
            }
        } catch (error) {
            console.error("Failed to fetch top creators", error);
        }
    };

    // Separate artworks by category
    const visualWorks = artworks.filter(art => art.category !== 'Audio');
    const audioWorks = artworks.filter(art => art.category === 'Audio');

    const placeholderImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2570&auto=format&fit=crop",
    ];

    // Sort visual works by most views for the showcase
    const mostViewedWorks = useMemo(() => {
        return [...visualWorks]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 10);
    }, [visualWorks]);

    const marqueeItems = mostViewedWorks.length > 0
        ? mostViewedWorks.map(art => ({
            img: (art.previewUrl || art.fileUrl)?.startsWith("http")
                ? (art.previewUrl || art.fileUrl)
                : `${API_URL.replace("/api", "")}${art.previewUrl || art.fileUrl}`,
            title: art.title,
            artist: art.artist?.name || "Unknown",
            views: art.views || 0,
            id: art._id,
        }))
        : placeholderImages.map((img, i) => ({
            img,
            title: `Artwork ${i + 1}`,
            artist: "Featured",
            views: 0,
            id: null,
        }));




    // const featuredArtists = [ ... ]; // Replacing with state


    return (
        <div className="flex-grow min-h-screen bg-[#0B0D10] text-[#E5E7EB] selection:bg-[#8B5CF6] selection:text-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center py-20 px-6 overflow-hidden">
                {/* Cinematic Glows */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
                />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                <div className="container mx-auto max-w-[1400px] z-20 relative h-full flex items-center">
                    <div className="w-full lg:w-[45%] z-20 relative py-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-10"
                        >
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white text-left">
                                    The Marketplace <br className="hidden sm:block" /> 
                                    for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                        Digital Creators.
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-cyan-400/80 max-w-xl font-light leading-relaxed">
                                    Buy and sell high-quality assets. Audio, Visuals, and Presets for the modern era.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link
                                    to="/explore"
                                    className="btn-primary text-center text-lg px-10 py-4"
                                >
                                    Explore Collection
                                </Link>
                                {!isAuthenticated && (
                                    <Link
                                        to="/register"
                                        className="btn-secondary text-center text-lg px-10 py-4"
                                    >
                                        Join Community
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side Visual Grid */}
                    <div className="hidden lg:block absolute top-[5%] bottom-[-5%] right-0 w-[50%] z-10 overflow-hidden pointer-events-none">
                        {/* Blur/Fade Gradient to blend the grid into the background on the left */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/80 to-transparent z-20 w-1/3" />
                        <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#0B0D10] to-transparent z-20 w-1/6" />
                        
                        {/* Masonry-style Image Grid */}
                        <div className="absolute top-0 right-0 w-full h-full flex gap-4 rotate-[-4deg] opacity-70">
                            {/* Column 1 */}
                            <motion.div 
                                className="flex flex-col gap-4 w-1/3 pt-20"
                                animate={{ y: ["0%", "-20%"] }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                            >
                                {marqueeItems.slice(0, 3).map((item, i) => (
                                    <Link key={i} to={item.id ? `/artwork/${item.id}` : "/explore"}>
                                        <img src={item.img} className="w-full rounded-2xl object-cover aspect-[4/5] opacity-50 shadow-2xl hover:opacity-100 transition-opacity" alt={item.title || ""} />
                                    </Link>
                                ))}
                            </motion.div>
                            {/* Column 2 */}
                            <motion.div 
                                className="flex flex-col gap-4 w-1/3 pt-0"
                                animate={{ y: ["-10%", "10%"] }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                            >
                                {marqueeItems.slice(3, 6).map((item, i) => (
                                    <Link key={i} to={item.id ? `/artwork/${item.id}` : "/explore"}>
                                        <img src={item.img} className="w-full rounded-2xl object-cover aspect-square opacity-70 shadow-2xl hover:opacity-100 transition-opacity" alt={item.title || ""} />
                                    </Link>
                                ))}
                                {marqueeItems[0] && (
                                    <Link to={marqueeItems[0].id ? `/artwork/${marqueeItems[0].id}` : "/explore"}>
                                        <img src={marqueeItems[0].img} className="w-full rounded-2xl object-cover aspect-[4/3] opacity-70 shadow-2xl hover:opacity-100 transition-opacity" alt={marqueeItems[0].title || ""} />
                                    </Link>
                                )}
                            </motion.div>
                            {/* Column 3 */}
                            <motion.div 
                                className="flex flex-col gap-4 w-1/3 pt-40"
                                animate={{ y: ["0%", "-30%"] }}
                                transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                            >
                                {marqueeItems.slice(6, 10).map((item, i) => (
                                    <Link key={i} to={item.id ? `/artwork/${item.id}` : "/explore"}>
                                        <img src={item.img} className="w-full rounded-2xl object-cover aspect-[3/4] opacity-50 shadow-2xl hover:opacity-100 transition-opacity" alt={item.title || ""} />
                                    </Link>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Arts Section */}
            <section className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-[#0B0D10]" />

                <div className="container mx-auto max-w-[1400px] relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Trending Visual Art
                            </h2>
                        </div>
                        <Link to="/explore?category=Visual Art" className="text-lg font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                            View All Visuals &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
                            ))
                        ) : visualWorks.length > 0 ? (
                            visualWorks.slice(0, 8).map((artwork) => (
                                <ArtworkCard key={artwork._id} artwork={artwork} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-cyan-400/60">No visual artworks found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Artists Section */}
            <section className="py-24 px-6 bg-[#141821] border-y border-white/10">
                <div className="container mx-auto max-w-[1400px]">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight">Featured Artists</h2>
                    {featuredArtists.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                            {featuredArtists.map((artist, i) => (
                                <Link to={`/artist/${artist.id}`} key={i} className="flex flex-col items-center group cursor-pointer block">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 mb-6 p-1">
                                        <img src={artist.img} alt={artist.name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{artist.name}</h3>
                                    <p className="text-cyan-400/80 text-sm flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        {artist.totalViews.toLocaleString()} views
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-cyan-400/60">No featured artists yet.</p>
                    )}
                </div>
            </section>

            {/* Audio Section */}
            <section className="py-24 px-6 bg-[#0B0D10]">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Trending Music Art
                            </h2>
                        </div>
                        <Link to="/explore?category=Audio" className="text-lg font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                            Browse Library &rarr;
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="h-28 w-full rounded-2xl bg-white/5 animate-pulse" />
                            ))
                        ) : audioWorks.length > 0 ? (
                            audioWorks.slice(0, 8).map((artwork) => (
                                <AudioWaveCard key={artwork._id} artwork={artwork} apiUrl={API_URL} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-cyan-400/60">No audio tracks found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Stay Inspired Section */}
            <section className="py-24 px-6 bg-[#0B0D10]">
                <div className="container mx-auto max-w-2xl text-center">
                    <div className="space-y-6 mb-10">
                        <h3 className="text-4xl font-bold text-white tracking-tight">Stay Inspired</h3>
                        <p className="text-cyan-400/80 text-lg font-light">Join 50,000+ creators getting weekly design resources and inspiration.</p>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!subscribeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
                                setSubscribeStatus("error");
                                return;
                            }

                            try {
                                const response = await axios.post(`${API_URL}/subscribe`, { email: subscribeEmail });
                                if (response.data.success) {
                                    setSubscribeStatus("success");
                                    setSubscribeEmail("");
                                } else {
                                    setSubscribeStatus("error");
                                }
                            } catch (error) {
                                console.error("Subscribe error:", error);
                                setSubscribeStatus("error");
                            }

                            setTimeout(() => setSubscribeStatus(""), 4000);
                        }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <input
                            type="email"
                            placeholder="Email address"
                            value={subscribeEmail}
                            onChange={(e) => { setSubscribeEmail(e.target.value); setSubscribeStatus(""); }}
                            className={`flex-1 px-6 py-4 rounded-xl bg-[#141821] border text-white focus:outline-none focus:border-cyan-500/50 transition-all ${subscribeStatus === "error" ? "border-red-500/50" : "border-white/10"
                                }`}
                        />
                        <button type="submit" className="btn-primary whitespace-nowrap px-8">
                            Subscribe
                        </button>
                    </form>
                    {subscribeStatus === "success" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-green-400 text-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            You're subscribed! Check your inbox for inspiration.
                        </motion.p>
                    )}
                    {subscribeStatus === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-red-400 text-sm"
                        >
                            Please enter a valid email address.
                        </motion.p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
