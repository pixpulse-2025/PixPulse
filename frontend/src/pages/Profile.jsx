import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ArtworkGrid from "../components/artwork/ArtworkGrid";
import { fetchMyUploads } from "../redux/slices/artworkSlice";
import { getAvatarUrl } from "../utils/imageUtils";

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("gallery");

    // Get artworks from redux state
    const { myArtworks } = useSelector((state) => state.artwork);
    
    useEffect(() => {
        dispatch(fetchMyUploads());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            {/* Profile Header */}
            <div className="bg-[#0B0D10] border-b border-white/5">
                <div className="container mx-auto max-w-[1400px] px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full border-4 border-[#141821] overflow-hidden flex-shrink-0">
                            <img
                                src={getAvatarUrl(user?.avatar, user?.name)}
                                alt={user?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {user?.name}
                                </h1>
                                <p className="text-base text-gray-400">
                                    {(user?.role || "Member").charAt(0).toUpperCase() + (user?.role || "Member").slice(1)} • Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-white">{myArtworks.length || 0}</p>
                                    <p className="text-sm text-gray-400">Artworks</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {user?.role !== 'admin' && (
                                    <Link to="/upload" className="btn-primary flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        Upload Artwork
                                    </Link>
                                )}
                                <Link to="/settings" className="btn-secondary flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Edit Profile
                                </Link>
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
                            {myArtworks.length > 0 ? (
                                <ArtworkGrid artworks={myArtworks} loading={false} />
                            ) : (
                                <div className="card-surface py-20 text-center">
                                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <h3 className="text-xl font-bold text-white mb-2">No artworks yet</h3>
                                    <p className="text-gray-400 mb-6">Start sharing your creative work with the community</p>
                                    {user?.role !== 'admin' && (
                                        <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            Upload Your First Artwork
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="max-w-3xl">
                            <div className="card-surface p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Bio</h3>
                                    <p className="text-base text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {user?.bio || "No bio added yet. Tell the community about yourself in settings!"}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <span className="text-sm">{user?.email}</span>
                                        </div>
                                        {user?.website && (
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#8B5CF6] hover:underline">
                                                    {user.website}
                                                </a>
                                            </div>
                                        )}
                                        {user?.location && (
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                <span className="text-sm">{user.location}</span>
                                            </div>
                                        )}
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

export default Profile;

