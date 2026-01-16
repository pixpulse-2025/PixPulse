import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, users, artists, blocked
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/users`);
            setUsers(data.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId, isBlocked) => {
        if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) {
            return;
        }

        try {
            await axios.patch(`${API_URL}/users/${userId}`, {
                isBlocked: !isBlocked
            });

            // Update local state
            setUsers(users.map(u =>
                u._id === userId ? { ...u, isBlocked: !isBlocked } : u
            ));

            // Show success message
            const message = isBlocked ? 'User unblocked successfully' : 'User blocked successfully';
            alert(message);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await axios.patch(`${API_URL}/users/${userId}`, {
                role: newRole
            });

            setUsers(users.map(u =>
                u._id === userId ? { ...u, role: newRole } : u
            ));

            alert('User role updated successfully');
            setShowModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update role');
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        // Search filter
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Role/status filter
        if (filter === "users") return user.role === "user";
        if (filter === "artists") return user.role === "artist";
        if (filter === "blocked") return user.isBlocked;
        return true; // all
    });

    // Statistics
    const stats = {
        total: users.length,
        users: users.filter(u => u.role === "user").length,
        artists: users.filter(u => u.role === "artist").length,
        blocked: users.filter(u => u.isBlocked).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            User Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage users, roles, and permissions
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Regular Users</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Artists</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.artists}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Blocked</p>
                        <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            {["all", "users", "artists", "blocked"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                            ? "bg-primary-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                            : user.role === "artist"
                                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                        }`}
                                                >
                                                    {user.role}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.isBlocked ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                        🚫 Blocked
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                        ✓ Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleBlockUser(user._id, user.isBlocked)}
                                                        className={`px-3 py-1 rounded-lg font-medium transition-colors ${user.isBlocked
                                                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
                                                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                            }`}
                                                    >
                                                        {user.isBlocked ? "Unblock" : "Block"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Role Change Modal */}
                {showModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                        <div className="glass rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Change User Role
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Change role for <span className="font-medium">{selectedUser.name}</span>
                            </p>
                            <div className="space-y-3">
                                {["user", "artist", "admin"].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleChangeRole(selectedUser._id, role)}
                                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${selectedUser.role === role
                                                ? "bg-primary-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                        {selectedUser.role === role && " (Current)"}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
