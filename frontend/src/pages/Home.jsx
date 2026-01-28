import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { fetchArtworks, selectArtworks, selectArtworkLoading } from "../redux/slices/artworkSlice";
import { motion, useScroll, useTransform } from "framer-motion";
import ArtworkCard from "../components/artwork/ArtworkCard";

const Home = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const artworks = useSelector(selectArtworks);
    const loading = useSelector(selectArtworkLoading);
    const { scrollYProgress } = useScroll();

    // Parallax background effect
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    useEffect(() => {
        dispatch(fetchArtworks({ limit: 20, sortBy: "popular" }));
    }, [dispatch]);

    // Separate artworks by category
    const visualWorks = artworks.filter(art => art.category !== 'Audio');
    const audioWorks = artworks.filter(art => art.category === 'Audio');

    const marqueeImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2570&auto=format&fit=crop",
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

            {/* Visual Arts Section */}
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
                        <Link to="/explore?category=Visual Art" className="text-lg font-bold uppercase tracking-widest border-b-4 border-[#7091E6] pb-2 hover:text-[#3D52A0] transition-all">
                            See More
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            ))
                        ) : visualWorks.length > 0 ? (
                            visualWorks.slice(0, 8).map((artwork) => (
                                <ArtworkCard key={artwork._id} artwork={artwork} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No visual artworks found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Music/Audio Section */}
            <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                                Music Samples
                            </h2>
                            <p className="text-base text-gray-600">
                                Premium audio productions for creators
                            </p>
                        </div>
                        <Link to="/explore?category=Audio" className="text-lg font-bold uppercase tracking-widest border-b-4 border-[#7091E6] pb-2 hover:text-[#3D52A0] transition-all">
                            Browse Audio
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            ))
                        ) : audioWorks.length > 0 ? (
                            audioWorks.slice(0, 8).map((artwork) => (
                                <ArtworkCard key={artwork._id} artwork={artwork} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No audio tracks found.</p>
                        )}
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
