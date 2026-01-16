import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Explore = () => {
    const { isAuthenticated } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const categories = [
        { id: "all", name: "All Artworks", icon: "🎨" },
        { id: "digital", name: "Digital Art", icon: "💻" },
        { id: "photography", name: "Photography", icon: "📷" },
        { id: "illustration", name: "Illustration", icon: "✏️" },
        { id: "3d", name: "3D Art", icon: "🎭" },
        { id: "abstract", name: "Abstract", icon: "🌈" },
    ];

    // Mock artwork data - replace with Redux state later
    const artworks = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Artwork ${i + 1}`,
        artist: `Artist ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 1000),
        image: `https://picsum.photos/400/400?random=${i}`,
    }));

    return (
        <div className="flex-grow pt-32 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        Explore Artworks
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Discover amazing digital art from talented creators worldwide
                    </p>
                </div>

                {/* Filters */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Categories */}
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.id
                                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="w-full lg:w-auto">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full lg:w-48 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Artwork Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {artworks.map((artwork) => (
                        <div
                            key={artwork.id}
                            className="glass rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800">
                                <img
                                    src={artwork.image}
                                    alt={artwork.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                            View
                                        </button>
                                        {isAuthenticated && (
                                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                                    {artwork.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    by {artwork.artist}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                        ${artwork.price}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm">{artwork.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                    <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95">
                        Load More Artworks
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Explore;
