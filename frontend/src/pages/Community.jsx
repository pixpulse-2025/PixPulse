import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Community = () => {
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState("feed");

    // Mock data - replace with Redux state later
    const posts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        author: `Artist ${i + 1}`,
        avatar: `https://ui-avatars.com/api/?name=Artist+${i + 1}&background=random`,
        content: `Just finished working on this amazing piece! What do you think? #digitalart #creative`,
        image: `https://picsum.photos/600/400?random=${i}`,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        timestamp: `${i + 1}h ago`,
    }));

    const trendingTopics = [
        { tag: "digitalart", posts: 1234 },
        { tag: "illustration", posts: 892 },
        { tag: "photography", posts: 756 },
        { tag: "3dart", posts: 543 },
        { tag: "abstract", posts: 421 },
    ];

    return (
        <div className="flex-grow pt-32 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        Community
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Connect with fellow artists and share your creative journey
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="glass rounded-2xl p-2 flex gap-2">
                            <button
                                onClick={() => setActiveTab("feed")}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "feed"
                                        ? "bg-primary-600 text-white shadow-lg"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Feed
                            </button>
                            <button
                                onClick={() => setActiveTab("trending")}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "trending"
                                        ? "bg-primary-600 text-white shadow-lg"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Trending
                            </button>
                            <button
                                onClick={() => setActiveTab("following")}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "following"
                                        ? "bg-primary-600 text-white shadow-lg"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Following
                            </button>
                        </div>

                        {/* Create Post */}
                        {isAuthenticated && (
                            <div className="glass rounded-2xl p-6">
                                <div className="flex gap-4">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`}
                                        alt="Your avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Share your thoughts or latest work..."
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            rows="3"
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors">
                                                Post
                                            </button>
                                            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post.id} className="glass rounded-2xl p-6">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={post.avatar}
                                            alt={post.author}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                {post.author}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {post.timestamp}
                                            </p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                        {post.content}
                                    </p>

                                    {/* Post Image */}
                                    <div className="rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={post.image}
                                            alt="Post"
                                            className="w-full h-auto"
                                        />
                                    </div>

                                    {/* Post Actions */}
                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="font-medium">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="font-medium">{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-auto">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Trending Topics */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Trending Topics
                            </h3>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, index) => (
                                    <div
                                        key={topic.tag}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                    #{index + 1}
                                                </span>
                                                <span className="font-semibold text-primary-600 dark:text-primary-400">
                                                    #{topic.tag}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {topic.posts} posts
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Artists */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Suggested Artists
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=Suggested+${i}&background=random`}
                                            alt={`Suggested ${i}`}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                Suggested Artist {i}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {Math.floor(Math.random() * 10)}K followers
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors">
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
