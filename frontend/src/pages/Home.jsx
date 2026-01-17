import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { fetchArtworks, selectArtworks, selectArtworkLoading } from "../redux/slices/artworkSlice";
import { motion, useScroll, useTransform } from "framer-motion";

const Home = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const artworks = useSelector(selectArtworks);
    const loading = useSelector(selectArtworkLoading);
    const { scrollYProgress } = useScroll();

    // Parallax background effect
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    useEffect(() => {
        dispatch(fetchArtworks({ limit: 8, sortBy: "popular" }));
    }, [dispatch]);

    const marqueeImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2570&auto=format&fit=crop",
    ];

    const sampleArts = [
        {
            id: 'sample-1',
            title: 'Electric Sky',
            artist: 'Alex Rivera',
            image: marqueeImages[2],
            category: 'Digital Art',
            color: 'from-[#3D52A0]/40'
        },
        {
            id: 'sample-2',
            title: 'Indigo Waves',
            artist: 'Sarah Chen',
            image: marqueeImages[3],
            category: '3D Art',
            color: 'from-[#7091E6]/40'
        },
        {
            id: 'sample-3',
            title: 'Night Glow',
            artist: 'Mark Wilson',
            image: marqueeImages[0],
            category: 'Abstract',
            color: 'from-[#8697C4]/40'
        },
        {
            id: 'sample-4',
            title: 'Neon Pulse',
            artist: 'Emma Davis',
            image: marqueeImages[1],
            category: 'Illustration',
            color: 'from-[#ADBBDA]/40'
        }
    ];

    const sampleBeats = [
        { id: 1, title: "Midnight Lofi", bpm: "88 BPM", duration: "2:45", artist: "OceanWaves", color: "bg-[#3D52A0]" },
        { id: 2, title: "Neon Drive", bpm: "124 BPM", duration: "3:12", artist: "SynthLord", color: "bg-[#7091E6]" },
        { id: 3, title: "Deep Pulse", bpm: "140 BPM", duration: "2:30", artist: "SubAtomic", color: "bg-[#8697C4]" },
    ];

    return (
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center pt-20 px-6 bg-white dark:bg-gray-900">
                <div className="container mx-auto max-w-[1400px] z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl space-y-10"
                    >
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] uppercase tracking-tighter text-gray-900 dark:text-white">
                                Design and <br />
                                Share Art.
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
                                High-quality images, music, and videos for your next project. Join the world's most vibrant creative community.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                to="/explore"
                                className="btn-primary text-center text-lg px-8 py-4 rounded-lg"
                            >
                                Explore Works
                            </Link>
                            {!isAuthenticated && (
                                <Link
                                    to="/register"
                                    className="btn-secondary text-center text-lg px-8 py-4 rounded-lg"
                                >
                                    Join Now
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Palette Glow Elements */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute right-[5%] top-[10%] w-[500px] h-[500px] bg-[#7091E6]/20 rounded-full blur-[120px] pointer-events-none"
                />
                <div className="absolute left-[10%] bottom-[10%] w-[400px] h-[400px] bg-[#ADBBDA]/30 rounded-full blur-[100px] pointer-events-none" />
            </section>

            {/* Horizontal Scroll Gallery */}
            <div className="py-12 bg-background overflow-hidden whitespace-nowrap border-y border-[#3D52A0]/5">
                <motion.div
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="flex gap-8 items-center w-max"
                >
                    {[...marqueeImages, ...marqueeImages].map((img, i) => (
                        <div key={i} className="w-[300px] md:w-[450px] aspect-[16/10] rounded-3xl overflow-hidden bg-white/5 border border-[#3D52A0]/10 group">
                            <img src={img} className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-1000" alt="Art preview" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* New Art Section */}
            <section className="py-40 px-6">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text">
                                New Editions
                            </h2>
                            <p className="text-sm font-bold text-text/40 uppercase tracking-widest">
                                Discover our latest curated visual artworks
                            </p>
                        </div>
                        <Link to="/explore" className="text-lg font-bold uppercase tracking-widest border-b-4 border-[#7091E6] pb-2 hover:text-[#3D52A0] transition-all">
                            See More
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sampleArts.map((art) => (
                            <div
                                key={art.id}
                                className="group relative bg-[#ADBBDA]/10 dark:bg-white/5 rounded-[2.5rem] overflow-hidden aspect-[4/5] border border-[#3D52A0]/5 hover:shadow-[0_40px_80px_rgba(61,82,160,0.15)] transition-all duration-700"
                            >
                                <img
                                    src={art.image}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt={art.title}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${art.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="absolute inset-x-0 bottom-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-[#3D52A0] via-[#3D52A0]/80 to-transparent">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#EDE8F5]/60 mb-2">{art.category}</p>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none italic">{art.title}</h3>
                                    <p className="text-xs font-bold text-white/40 mt-3 flex items-center gap-2">
                                        <span className="w-4 h-px bg-white/20"></span>
                                        {art.artist}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Music Section */}
            <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                            Music Samples
                        </h1>
                        <p className="text-base text-gray-600">
                            Premium audio productions for creators
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleBeats.map((beat) => (
                            <div key={beat.id} className="card-surface p-6 hover:shadow-lg transition-all duration-300">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 ${beat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{beat.bpm}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{beat.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{beat.artist}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <button className="w-10 h-10 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center hover:bg-[#075985] dark:hover:bg-[#0284C7] transition-all shadow-sm active:scale-95">
                                            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </button>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{beat.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-6 bg-white dark:bg-gray-900">
                <div className="container mx-auto max-w-4xl">
                    <div className="card-surface p-12 text-center">
                        <div className="space-y-4 mb-8">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Stay Updated</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">Join our community to get the latest artworks and updates delivered to your inbox</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input-field flex-1"
                            />
                            <button className="btn-primary whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
