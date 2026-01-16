import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchArtworks, setFilters } from "../redux/slices/artworkSlice";

const categories = [
    "All",
    "Visual Art",
    "Audio",
    "Video/Animation",
    "Presets/Resources",
    "Other Creative Assets",
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
];

const Marketplace = () => {
    const dispatch = useDispatch();
    const { artworks, loading, error, filters } = useSelector((state) => state.artwork);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSort, setSelectedSort] = useState("newest");
    const [priceFilter, setPriceFilter] = useState("all");

    useEffect(() => {
        const params = {
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            sort: selectedSort,
            search: searchQuery,
            priceType: priceFilter !== "all" ? priceFilter : undefined,
        };
        dispatch(fetchArtworks(params));
    }, [dispatch, selectedCategory, selectedSort, searchQuery, priceFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            sort: selectedSort,
            search: searchQuery,
            priceType: priceFilter !== "all" ? priceFilter : undefined,
        };
        dispatch(fetchArtworks(params));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Discover Creative Assets
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore thousands of premium digital artworks, music, presets, and more from talented creators worldwide.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="glass rounded-2xl p-2 flex items-center gap-2 max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search artworks, artists, tags..."
                            className="flex-1 px-6 py-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            🔍 Search
                        </button>
                    </div>
                </form>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === cat
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                                        : "glass text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort & Price Filters */}
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="px-6 py-3 rounded-xl glass border-0 outline-none text-gray-900 dark:text-white cursor-pointer"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-2 glass rounded-xl p-1">
                            <button
                                onClick={() => setPriceFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceFilter === "all"
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setPriceFilter("Free")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceFilter === "Free"
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                Free
                            </button>
                            <button
                                onClick={() => setPriceFilter("Paid")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceFilter === "Paid"
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                Premium
                            </button>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {artworks.length} {artworks.length === 1 ? 'result' : 'results'}
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 text-center">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && artworks.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-64 bg-gray-200 dark:bg-gray-800"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : artworks.length === 0 ? (
                    /* Empty State */
                    <div className="glass rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No artworks found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Try adjusting your filters or search query
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                                setPriceFilter("all");
                            }}
                            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* Artwork Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {artworks.map((artwork) => (
                            <Link
                                key={artwork._id}
                                to={`/artwork/${artwork._id}`}
                                className="glass rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                    <img
                                        src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                        }}
                                    />
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex items-center gap-4 text-white text-sm">
                                            <span className="flex items-center gap-1">
                                                👁️ {artwork.views || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                ❤️ {artwork.likes?.length || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                📥 {artwork.downloads || 0}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Price Badge */}
                                    <div className="absolute top-3 right-3">
                                        {artwork.priceType === "Free" ? (
                                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                FREE
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                ${artwork.price}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                                        {artwork.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        {artwork.category}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                        {artwork.description}
                                    </p>
                                    {/* Artist Info */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <img
                                            src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name}&background=random`}
                                            alt={artwork.artist?.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {artwork.artist?.name || "Anonymous"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
