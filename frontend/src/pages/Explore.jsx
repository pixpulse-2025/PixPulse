import { useState, useEffect, useRef, useCallback } from "react";
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

const Explore = () => {
    const dispatch = useDispatch();
    const artworks = useSelector(selectArtworks);
    const loading = useSelector(selectArtworkLoading);
    const pagination = useSelector(selectArtworkPagination);
    const filters = useSelector(selectArtworkFilters);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
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
        { id: "all", name: "All Works" },
        { id: "visual-art", name: "Visual Art" },
        { id: "audio", name: "Audio" },
        { id: "video-animation", name: "Video/Animation" },
        { id: "presets-resources", name: "Presets/Resources" },
        { id: "other-assets", name: "Other Assets" },
    ];

    const subCategories = {
        "visual-art": [
            "Digital Paintings", "Illustrations", "Concept Art", "Photography",
            "3D Models", "Vector Art", "Pixel Art", "Abstract", "Anime/Manga",
            "Mixed Media", "Posters", "Wallpapers", "Motion Graphics"
        ],
        "audio": ["Music tracks", "Beats", "Sound Effects", "Loops", "Voice Samples"],
        "video-animation": ["Short Animations", "Motion Templates", "VFX"],
        "presets-resources": ["Lightroom Presets", "Photoshop Brushes", "LUTs", "3D/Animation Presets"],
        "other-assets": ["Fonts", "Icons", "UI Kits", "Background Textures"]
    };

    const [selectedSubCategory, setSelectedSubCategory] = useState("all");

    useEffect(() => {
        dispatch(fetchArtworks({
            page,
            category: filters.category,
            sortBy: filters.sortBy,
            search: filters.search
        }));
    }, [dispatch, page, filters]);

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
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="pt-32 pb-10 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                Explore Artworks
                            </h1>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                Discover amazing digital creations from talented artists
                            </p>
                        </div>

                        <form onSubmit={handleSearch} className="w-full max-w-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search artworks..."
                                    className="input-field pr-12"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
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
                                        ? "bg-primary text-white dark:bg-accent"
                                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Subcategory Filter - Shows when a main category is selected */}
                        {filters.category !== "all" && subCategories[filters.category] && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Type:</span>
                                <button
                                    onClick={() => setSelectedSubCategory("all")}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${selectedSubCategory === "all"
                                        ? "bg-accent text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    All
                                </button>
                                {subCategories[filters.category].map((subCat) => (
                                    <button
                                        key={subCat}
                                        onClick={() => setSelectedSubCategory(subCat)}
                                        className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${selectedSubCategory === subCat
                                            ? "bg-accent text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {subCat}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="popular">Popular</option>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="most-viewed">Most Viewed</option>
                                <option value="most-downloaded">Most Downloaded</option>
                                <option value="rating">Highest Rated</option>
                            </select>

                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price:</span>
                            <select
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Prices</option>
                                <option value="free">Free</option>
                                <option value="under-10">Under $10</option>
                                <option value="10-50">$10 - $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="over-100">Over $100</option>
                            </select>

                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating:</span>
                            <select
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">⭐⭐⭐⭐⭐ Only</option>
                                <option value="4">⭐⭐⭐⭐ & Up</option>
                                <option value="3">⭐⭐⭐ & Up</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-[1400px] px-6 py-12">
                <ArtworkGrid artworks={artworks} loading={loading && page === 1} />

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
        </div>
    );
};

export default Explore;
