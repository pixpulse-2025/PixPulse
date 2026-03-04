import ArtworkCard from "./ArtworkCard";

/**
 * ArtworkGrid Component
 * A responsive grid layout for displaying artwork cards.
 * Handles empty states and loading skeletons.
 */
const ArtworkGrid = ({ artworks, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-text/5 rounded-2xl aspect-[4/3] animate-pulse" />
                ))}
            </div>
        );
    }

    if (!artworks || artworks.length === 0) {
        return (
            <div className="text-center py-20 px-6 glass rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No Artworks Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Be the first to upload amazing digital art to our gallery.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
        </div>
    );
};

export default ArtworkGrid;
