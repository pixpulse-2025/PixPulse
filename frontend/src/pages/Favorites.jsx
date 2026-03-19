import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFavorites } from "../redux/slices/favoritesSlice";
import ArtworkCard from "../components/artwork/ArtworkCard";

const Favorites = () => {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    if (loading && favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-40 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            My Favorites
                        </h1>
                    </div>
                    <p className="text-base text-gray-400">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved in your collection
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className="card-surface py-20 text-center">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                        <p className="text-gray-400 mb-6">Explore our collection and save what you love</p>
                        <Link to="/explore" className="btn-primary inline-flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Explore Artworks
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite) => {
                            const artwork = favorite.artwork;
                            if (!artwork) return null;
                            return <ArtworkCard key={favorite._id || (artwork._id + '-fav')} artwork={artwork} />;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
