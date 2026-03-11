import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null); // For viewing full message modal

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/contact`);
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Failed to load messages. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await axios.patch(`${API_URL}/contact/${id}`, { status: newStatus });
            if (response.data.success) {
                setMessages(messages.map(msg => msg._id === id ? { ...msg, status: newStatus } : msg));
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage({ ...selectedMessage, status: newStatus });
                }
            }
        } catch (err) {
            console.error("Error updating message status:", err);
            alert("Failed to update message status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            const response = await axios.delete(`${API_URL}/contact/${id}`);
            if (response.data.success) {
                setMessages(messages.filter(msg => msg._id !== id));
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Failed to delete message.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "unread":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">Unread</span>;
            case "read":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">Read</span>;
            case "resolved":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Resolved</span>;
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
                        <p className="text-gray-400">View and manage inquiries from users.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-[#141821] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-[#1a1f2e] text-gray-300 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {messages.length > 0 ? (
                                    messages.map((message) => (
                                        <tr key={message._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{message.name}</span>
                                                    <a href={`mailto:${message.email}`} className="text-xs text-blue-400 hover:underline">{message.email}</a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-300">
                                                {message.subject || "No Subject"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(message.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(message.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMessage(message);
                                                            if (message.status === 'unread') {
                                                                handleUpdateStatus(message._id, 'read');
                                                            }
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(message._id)}
                                                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No messages found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            {
                selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#141821] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative">
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="flex justify-between items-start mb-6 pr-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject || "No Subject"}</h2>
                                    <div className="text-sm text-gray-400 flex flex-col gap-1">
                                        <p>From: <span className="text-white font-medium">{selectedMessage.name}</span> (<a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:underline">{selectedMessage.email}</a>)</p>
                                        <p>Date: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                            </div>

                            <div className="bg-[#0B0D10] border border-white/5 rounded-xl p-5 mb-6 max-h-[50vh] overflow-y-auto">
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                    className="btn-primary px-6 py-2 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Reply via Email
                                </a>

                                <div className="flex gap-3">
                                    {selectedMessage.status !== 'resolved' && (
                                        <button
                                            onClick={() => handleUpdateStatus(selectedMessage._id, 'resolved')}
                                            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors font-medium border border-emerald-500/20"
                                        >
                                            Mark as Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AdminMessages;
