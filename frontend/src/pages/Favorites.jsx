import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFavorites, removeFromFavorites } from "../redux/slices/favoritesSlice";

const Favorites = () => {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    const handleRemove = (artworkId) => {
        if (window.confirm("Remove from favorites?")) {
            dispatch(removeFromFavorites(artworkId));
        }
    };

    if (loading && favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center">
                        <div className="text-6xl mb-4">❤️</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Start adding artworks you love to your favorites!
                        </p>
                        <Link
                            to="/marketplace"
                            className="inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                        >
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite) => {
                            const artwork = favorite.artwork;
                            if (!artwork) return null;

                            return (
                                <div key={favorite._id} className="glass rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                    {/* Image */}
                                    <Link to={`/artwork/${artwork._id}`} className="block relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                        <img
                                            src={`http://localhost:5000${artwork.previewUrl || artwork.fileUrl}`}
                                            alt={artwork.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                            }}
                                        />
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
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemove(artwork._id);
                                            }}
                                            className="absolute top-3 left-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            ✕
                                        </button>
                                    </Link>

                                    {/* Details */}
                                    <div className="p-4">
                                        <Link to={`/artwork/${artwork._id}`}>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate hover:text-primary-600 transition-colors">
                                                {artwork.title}
                                            </h3>
                                        </Link>
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
