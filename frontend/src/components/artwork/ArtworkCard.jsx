import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, selectIsFavorite, selectFavorites } from "../../redux/slices/favoritesSlice";
import { useAuth } from "../../hooks/useAuth";

const ArtworkCard = ({ artwork }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const isFavorite = useSelector(state => selectIsFavorite(state, artwork._id));
    const favorites = useSelector(selectFavorites);

    // Get favorite count for this artwork
    const favoriteCount = favorites.filter(fav =>
        (fav.artwork?._id || fav.artwork) === artwork._id
    ).length || artwork.favoriteCount || 0;

    const BASE_URL = "http://localhost:5000";
    const imageUrl = artwork.previewUrl || artwork.fileUrl
        ? `${BASE_URL}${artwork.previewUrl || artwork.fileUrl}`
        : `https://picsum.photos/800/600?random=${artwork._id || Math.random()}`;

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            dispatch(toggleFavorite(artwork._id));
        }
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
            <Link to={`/artwork/${artwork._id}`} className="block relative aspect-[3/4] bg-gray-900">
                <img
                    src={imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    {/* Top: Heart Icon with Count */}
                    <div className="flex items-start justify-end">
                        <button
                            onClick={handleFavorite}
                            className={`h-10 px-3 rounded-full backdrop-blur-sm border flex items-center gap-2 transition-all ${isFavorite
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                                }`}
                        >
                            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm font-semibold">{favoriteCount}</span>
                        </button>
                    </div>

                    {/* Bottom: Creator Info & Price */}
                    <div className="flex items-end justify-between">
                        <Link
                            to={`/profile/${artwork.artist?._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                <img
                                    src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name || 'Artist'}&background=random`}
                                    alt={artwork.artist?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {artwork.artist?.name || 'Anonymous'}
                            </span>
                        </Link>

                        {/* Price */}
                        <div className="px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <span className="text-sm font-bold text-white">
                                ${artwork.price || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ArtworkCard;
