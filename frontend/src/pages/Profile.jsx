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
                                <p className="text-base text-gray-400 mb-3">
                                    {user?.artistType || (user?.role || "Member").charAt(0).toUpperCase() + (user?.role || "Member").slice(1)} • Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                                    {user?.location && (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {user.location}
                                        </div>
                                    )}
                                    {user?.website && (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                            <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#8B5CF6] transition-colors">
                                                {user.website.replace(/(^\w+:|^)\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
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
                                        {user?.socialLinks && Object.values(user.socialLinks).some(handle => handle) && (
                                            <div className="pt-6 border-t border-white/5 mt-6 w-full">
                                                <h4 className="text-[15px] font-medium text-gray-200 mb-4 block">Follow on Social</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {Object.entries(user.socialLinks).map(([platform, handle]) => {
                                                        if (!handle) return null;
                                                        let url = '#';
                                                        let icon = null;
                                                        const cleanHandle = handle.replace('@', '');
                                                        
                                                        if (platform === 'instagram') {
                                                            url = `https://instagram.com/${cleanHandle}`;
                                                            icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>;
                                                        } else if (platform === 'dribbble') {
                                                            url = `https://dribbble.com/${cleanHandle}`;
                                                            icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.156-.134-.311-.205-.466a35.133 35.133 0 00-1.889-3.702c2.723-1.309 4.887-1.284 5.093-1.284a8.452 8.452 0 011.014.41zm-1.637-1.115c-.156.009-2.003.04-4.526 1.152A30.957 30.957 0 008.57 3.593c1.071-.347 2.21-.543 3.4-.543 1.956 0 3.758.646 5.228 1.745l-.23-.075zm-6.843 1.05c1.196.96 2.378 2.222 3.456 3.692a35.918 35.918 0 00-4.228 1.488C7.576 8.163 5.488 6.577 5.1 6.273a8.528 8.528 0 015.025-2.731zm-6.19 2.508c.328.256 2.225 1.71 4.316 3.525-1.153 2.529-2.43 4.954-3.714 6.755A8.441 8.441 0 013.84 10.37c-.015-.444.07-.886.19-1.317zm1.18 8.35c1.23-1.745 2.553-4.148 3.765-6.666 1.49.336 2.924.787 4.298 1.34-1.07 3.033-2.31 5.952-3.69 8.281a8.498 8.498 0 01-4.373-2.956zm6.393 3.468c1.37-2.327 2.613-5.234 3.71-8.239 2.596.53 4.96.446 5.567.414A8.502 8.502 0 0112 21.033c-.198 0-.395-.006-.59-.017z" clipRule="evenodd" /></svg>;
                                                        } else if (platform === 'facebook') {
                                                            url = `https://facebook.com/${cleanHandle}`;
                                                            icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>;
                                                        } else {
                                                            return null;
                                                        }

                                                        return (
                                                            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-full bg-[#1A1F2B] flex items-center justify-center text-white hover:bg-[#8B5CF6] transition-all duration-300 shadow-md">
                                                                {icon}
                                                            </a>
                                                        );
                                                    })}
                                                </div>
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

