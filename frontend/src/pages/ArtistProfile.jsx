import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ArtworkGrid from "../components/artwork/ArtworkGrid";
import { getAvatarUrl } from "../utils/imageUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ArtistProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("gallery");
    const [artist, setArtist] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/users/profile/${id}`);
                setArtist(response.data.data.user);
                setArtworks(response.data.data.artworks);
            } catch (err) {
                console.error("Error fetching artist profile:", err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-40 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center pt-32">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
                    <p className="text-gray-400 mb-8">{error || "The artist profile you are looking for does not exist."}</p>
                    <a href="/explore" className="btn-primary">Browse Artworks</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            {/* Profile Header */}
            <div className="bg-[#0B0D10] border-b border-white/5">
                <div className="container mx-auto max-w-[1400px] px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full border-4 border-[#141821] overflow-hidden flex-shrink-0">
                            <img
                                src={getAvatarUrl(artist.avatar, artist.name)}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {artist.name}
                                </h1>
                                <p className="text-base text-gray-400">
                                    {artist.role || "Artist"} • Joined {new Date(artist.createdAt).getFullYear()}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-white">{artworks.length}</p>
                                    <p className="text-sm text-gray-400">Artworks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-[1400px] px-6 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-2 bg-[#141821] rounded-lg p-2 border border-white/5 mb-8 max-w-sm">
                    {[
                        { id: "gallery", label: "Gallery" },
                        { id: "about", label: "About" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 text-sm font-semibold px-4 py-2 rounded-md transition-all ${activeTab === tab.id
                                ? "bg-[#8B5CF6] text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === "gallery" && (
                        <div>
                            {artworks.length > 0 ? (
                                <ArtworkGrid artworks={artworks} loading={false} />
                            ) : (
                                <div className="card-surface py-20 text-center">
                                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <h3 className="text-xl font-bold text-white mb-2">No artworks yet</h3>
                                    <p className="text-gray-400 mb-6">This artist hasn't uploaded any artworks.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="max-w-3xl">
                            <div className="card-surface p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Biography</h3>
                                    <p className="text-base text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {artist.bio || "This artist hasn't written a biography yet."}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Contact Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <a href={`mailto:${artist.email}`} className="text-sm hover:text-violet-400 transition-colors">{artist.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
