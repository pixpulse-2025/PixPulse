import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Community = () => {
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState("feed");

    // Mock data
    const posts = [
        {
            id: 1,
            author: "Astrid Luna",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            content: "Just finalized the new neon collection. Color theory at its peak. #neon #vivid #community",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2570&auto=format&fit=crop",
            likes: 1240,
            comments: 42,
            timestamp: "2h ago",
        },
        {
            id: 2,
            author: "Kaito Design",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            content: "Experimental motion tracking with these fluid shapes. #motion #3d #render",
            image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
            likes: 850,
            comments: 15,
            timestamp: "5h ago",
        },
    ];

    const trendingTopics = [
        { tag: "vibrant", posts: 1234 },
        { tag: "modernism", posts: 892 },
        { tag: "motion", posts: 756 },
        { tag: "3drender", posts: 543 },
        { tag: "colorflow", posts: 421 },
    ];

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Community Feed
                    </h1>
                    <p className="text-base text-gray-400">
                        Share and connect with creators worldwide
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Primary Feed */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Tab System */}
                        <div className="flex gap-4 bg-[#141821] rounded-lg p-2 border border-white/5">
                            {[
                                { id: "feed", label: "Feed" },
                                { id: "trending", label: "Trending" },
                                { id: "following", label: "Following" }
                            ].map(tab => (
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

                        {/* Composer */}
                        {isAuthenticated && (
                            <div className="card-surface p-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                                        <img
                                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0369a1&color=fff`}
                                            alt="Your avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Share your work or thoughts..."
                                            className="w-full px-4 py-3 bg-[#0B0D10] border-2 border-white/5 text-white placeholder-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                                            rows="3"
                                        />
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </button>
                                            </div>
                                            <button className="btn-primary text-sm px-6 py-2">
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts */}
                        {posts.map(post => (
                            <div key={post.id} className="card-surface overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={post.avatar}
                                            alt={post.author}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-white">{post.author}</h3>
                                            <p className="text-sm text-gray-400">{post.timestamp}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{post.content}</p>
                                </div>
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt="Post content"
                                        className="w-full aspect-video object-cover"
                                    />
                                )}
                                <div className="p-6 border-t border-white/5 flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        <span className="text-sm font-medium">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        <span className="text-sm font-medium">{post.comments}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Trending Topics */}
                        <div className="card-surface p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Trending Topics</h2>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">#{topic.tag}</p>
                                            <p className="text-sm text-gray-400">{topic.posts} posts</p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Artists */}
                        <div className="card-surface p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Suggested Artists</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700/50"></div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white text-sm">Artist Name</p>
                                            <p className="text-xs text-gray-400">Digital Artist</p>
                                        </div>
                                        <button className="btn-secondary text-xs px-3 py-1.5">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
