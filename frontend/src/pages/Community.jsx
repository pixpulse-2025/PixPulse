import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Community = () => {
    const { isAuthenticated, user } = useAuth();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [posting, setPosting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [topArtists, setTopArtists] = useState([]);

    // Fetch comments
    const fetchComments = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/comments?page=${targetPage}&limit=15`);
            if (data.success) {
                setComments(data.data);
                setTotalPages(data.pagination.totalPages);
                setPage(targetPage);
            }
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch top artists for sidebar
    const fetchTopArtists = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/users/top-creators`);
            if (data.success) {
                setTopArtists(data.data.slice(0, 5));
            }
        } catch (err) {
            console.error("Failed to fetch top artists:", err);
        }
    }, []);

    useEffect(() => {
        fetchComments();
        fetchTopArtists();
    }, [fetchComments, fetchTopArtists]);

    // Post a comment
    const handlePost = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setPosting(true);
            const { data } = await axios.post(`${API_URL}/comments`, { text: newComment });
            if (data.success) {
                setComments((prev) => [data.data, ...prev]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Failed to post comment:", err);
        } finally {
            setPosting(false);
        }
    };

    // Delete a comment
    const handleDelete = async (commentId) => {
        try {
            const { data } = await axios.delete(`${API_URL}/comments/${commentId}`);
            if (data.success) {
                setComments((prev) => prev.filter((c) => c._id !== commentId));
            }
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    // Like/unlike a comment
    const handleLike = async (commentId) => {
        if (!isAuthenticated) return;
        try {
            const { data } = await axios.patch(`${API_URL}/comments/${commentId}/like`);
            if (data.success) {
                setComments((prev) =>
                    prev.map((c) => (c._id === commentId ? data.data : c))
                );
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    // Format time ago
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

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
                        {/* Composer */}
                        {isAuthenticated ? (
                            <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                                <form onSubmit={handlePost}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                                            <img
                                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0369a1&color=fff`}
                                                alt="Your avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                placeholder="Share your thoughts with the community..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                maxLength={500}
                                                className="w-full px-4 py-3 bg-[#0B0D10] border-2 border-white/5 text-white placeholder-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                                                rows="3"
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs text-gray-500">
                                                    {newComment.length}/500
                                                </span>
                                                <button
                                                    type="submit"
                                                    disabled={posting || !newComment.trim()}
                                                    className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {posting ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                            Posting...
                                                        </span>
                                                    ) : "Post"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 text-center">
                                <p className="text-gray-400 mb-3">Sign in to join the conversation</p>
                                <a href="/login" className="text-[#8B5CF6] font-semibold hover:text-violet-400 transition-colors">
                                    Sign In →
                                </a>
                            </div>
                        )}

                        {/* Comments Feed */}
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-[#141821] border border-white/5 rounded-2xl p-6 animate-pulse">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-32 bg-white/5 rounded" />
                                                <div className="h-3 w-20 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => {
                                    const isOwn = user && comment.user?._id === user._id;
                                    const isAdmin = user?.role === "admin";
                                    const isLiked = user && comment.likes?.some((l) => (l._id || l) === user._id);

                                    return (
                                        <div
                                            key={comment._id}
                                            className="bg-[#141821] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                                                    <img
                                                        src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name || "U"}&background=random`}
                                                        alt={comment.user?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={comment.user?._id ? `/artist/${comment.user._id}` : "#"} className="font-semibold text-white text-sm hover:text-violet-400 transition-colors">
                                                                {comment.user?.name || "Unknown"}
                                                            </Link>
                                                            <span className="text-xs text-gray-500">
                                                                {timeAgo(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        {(isOwn || isAdmin) && (
                                                            <button
                                                                onClick={() => handleDelete(comment._id)}
                                                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                                                title="Delete comment"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                        {comment.text}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <button
                                                            onClick={() => handleLike(comment._id)}
                                                            disabled={!isAuthenticated}
                                                            className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked
                                                                ? "text-[#8B5CF6]"
                                                                : "text-gray-500 hover:text-[#8B5CF6]"
                                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                            <span className="font-medium">
                                                                {comment.likes?.length || 0}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 pt-4">
                                        <button
                                            onClick={() => fetchComments(page - 1)}
                                            disabled={page <= 1}
                                            className="px-4 py-2 rounded-lg bg-[#141821] border border-white/5 text-gray-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            ← Previous
                                        </button>
                                        <span className="px-4 py-2 text-gray-500 text-sm">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => fetchComments(page + 1)}
                                            disabled={page >= totalPages}
                                            className="px-4 py-2 rounded-lg bg-[#141821] border border-white/5 text-gray-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#141821] border border-white/5 rounded-2xl p-12 text-center">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-xl font-bold text-white mb-2">No comments yet</h3>
                                <p className="text-gray-500">Be the first to share something with the community!</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Community Stats */}
                        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Community Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#0B0D10] rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-white">{comments.length > 0 ? comments.length + "+" : "0"}</p>
                                    <p className="text-xs text-gray-500 mt-1">Comments</p>
                                </div>
                                <div className="bg-[#0B0D10] rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-white">{topArtists.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">Creators</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Artists */}
                        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Top Artists
                            </h2>
                            <div className="space-y-4">
                                {topArtists.length > 0 ? topArtists.map((artist, i) => (
                                    <Link to={`/artist/${artist._id}`} key={artist._id || i} className="group flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                <img
                                                    src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&background=random`}
                                                    alt={artist.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {i < 3 && (
                                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-amber-700"
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-sm truncate group-hover:text-violet-400 transition-colors">{artist.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {(artist.totalViews || 0).toLocaleString()} views
                                            </p>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">{artist.totalArtworks || 0} works</span>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-gray-500">No artists yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Community Guidelines */}
                        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-3">Community Guidelines</h2>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Be respectful and supportive
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Share constructive feedback
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Credit original creators
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    No spam or self-promotion
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
