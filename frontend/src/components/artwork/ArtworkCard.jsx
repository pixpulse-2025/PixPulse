import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, selectIsFavorite } from "../../redux/slices/favoritesSlice";
import { useAuth } from "../../hooks/useAuth";

const ArtworkCard = ({ artwork }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const isFavorite = useSelector(state => selectIsFavorite(state, artwork._id));

    const imageUrl = artwork.imageUrl
        ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:5000${artwork.imageUrl}`)
        : `https://picsum.photos/800/600?random=${artwork._id || Math.random()}`;

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            dispatch(toggleFavorite(artwork._id));
        }
    };

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:-translate-y-1">
            {/* Image Container */}
            <Link to={`/artwork/${artwork._id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                    src={imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Clean Semi-Transparent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white font-black uppercase tracking-tighter text-lg truncate pr-4">
                            {artwork.title}
                        </span>

                        <button
                            onClick={handleFavorite}
                            className={`p-3 rounded-full transition-all active:scale-90 ${isFavorite
                                ? "bg-white text-black scale-110 shadow-xl"
                                : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/20"
                                }`}
                        >
                            <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Link>

            {/* Info Below */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                            src={artwork.artist?.avatar || `https://ui-avatars.com/api/?name=${artwork.artist?.name || 'Artist'}&background=random`}
                            alt={artwork.artist?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {artwork.artist?.name || 'Anonymous'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        ${artwork.price || '0.00'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ArtworkCard;
