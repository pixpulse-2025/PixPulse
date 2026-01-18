import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ArtworkGrid from "../components/artwork/ArtworkGrid";

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("gallery");

    // Mock data check for current user artworks
    const artworks = useSelector((state) => state.artwork.artworks).filter(art => art.artist?._id === user?._id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto max-w-[1400px] px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden flex-shrink-0">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0369a1&color=fff`}
                                alt={user?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {user?.name}
                                </h1>
                                <p className="text-base text-gray-600 dark:text-gray-400">
                                    {user?.role || "Member"} • Member since 2024
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-gray-900">24</p>
                                    <p className="text-sm text-gray-600">Artworks</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-gray-900">1.2k</p>
                                    <p className="text-sm text-gray-600">Followers</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-2xl font-bold text-gray-900">85</p>
                                    <p className="text-sm text-gray-600">Favorites</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/upload" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0369A1] hover:bg-[#075985] dark:bg-[#0EA5E9] dark:hover:bg-[#0284C7] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    Upload Artwork
                                </Link>
                                <Link to="/settings" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95">
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
                <div className="flex gap-2 bg-white rounded-lg p-2 border border-gray-200 mb-8 max-w-md">
                    {[
                        { id: "gallery", label: "Gallery" },
                        { id: "about", label: "About" },
                        { id: "collections", label: "Collections" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 text-sm font-semibold px-4 py-2 rounded-md transition-all ${activeTab === tab.id
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-100"
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
                                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No artworks yet</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">Start sharing your creative work with the community</p>
                                    <Link to="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0369A1] hover:bg-[#075985] dark:bg-[#0EA5E9] dark:hover:bg-[#0284C7] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Upload Your First Artwork
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="max-w-3xl">
                            <div className="card-surface p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Biography</h3>
                                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        Creative designer focusing on clean and modern digital art. Passionate about exploring new techniques and pushing creative boundaries.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Digital Art", "Illustration", "3D Design", "Photography", "UI/UX"].map((skill) => (
                                            <span key={skill} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <span className="text-sm">{user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                            <span className="text-sm">www.example.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "collections" && (
                        <div className="card-surface py-20 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No collections yet</h3>
                            <p className="text-gray-600">Create collections to organize your favorite artworks</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
