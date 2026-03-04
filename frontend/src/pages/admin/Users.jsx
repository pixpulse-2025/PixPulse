import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, users, blocked
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal states
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem("token");
            await axios.patch(`${API_URL}/users/${userId}`, {
                isBlocked: !isBlocked
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

    // Alias for the JSX call
    const handleToggleBlock = handleBlockUser;

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(u => u._id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleChangeRole = async (userId, role) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`${API_URL}/users/${userId}`, {
                role: role
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(users.map(u =>
                u._id === userId ? { ...u, role: role } : u
            ));

            alert('User role updated successfully');
            setShowRoleModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update role');
        }
    };

    const handleRoleClick = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
    };

    const handleSaveRole = () => {
        if (selectedUser && newRole) {
            handleChangeRole(selectedUser._id, newRole);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-red-500/10 text-red-500";

            default:
                return "bg-blue-500/10 text-blue-500";
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        // Search filter
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Role filter
        if (roleFilter !== "all" && user.role !== roleFilter) return false;

        // Status filter (legacy filter state, if needed, or remove)
        // if (filter === "users") return user.role === "user"; // This seems redundant with roleFilter
        // if (filter === "blocked") return user.isBlocked;

        return true;
    });

    // Statistics
    const stats = {
        total: users.length,
        newThisMonth: users.filter(u => {
            const now = new Date();
            const joined = new Date(u.createdAt);
            return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
        }).length,

        admins: users.filter(u => u.role === "admin").length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            User Management
                        </h1>
                        <p className="text-gray-400">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Total Users</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">New (Month)</p>
                        <p className="text-2xl font-bold text-green-500">{stats.newThisMonth}</p>
                    </div>

                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Admins</p>
                        <p className="text-2xl font-bold text-blue-500">{stats.admins}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Role Filter */}
                        <div className="flex gap-2 text-sm md:text-base overflow-x-auto pb-2 md:pb-0">
                            {["all", "user", "admin"].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRoleFilter(r)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${roleFilter === r
                                        ? "bg-[#8B5CF6] text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}s
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#0B0D10] text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-white">{user.name}</p>
                                                        <p className="text-sm text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isBlocked ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRoleClick(user)}
                                                        className="p-2 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                                                        title="Change Role"
                                                    >
                                                        👑
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                                        className={`p-2 rounded-lg transition-colors ${user.isBlocked
                                                            ? "text-green-500 hover:bg-green-500/10"
                                                            : "text-red-500 hover:bg-red-500/10"
                                                            }`}
                                                        title={user.isBlocked ? "Unblock User" : "Block User"}
                                                    >
                                                        {user.isBlocked ? "🔓" : "🚫"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Role Change Modal */}
                {showRoleModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 w-full max-w-sm">
                            <h2 className="text-xl font-bold text-white mb-4">
                                Change Role
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Select a new role for <span className="font-bold text-white">{selectedUser.name}</span>
                            </p>

                            <div className="space-y-3 mb-6">
                                {["user", "admin"].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setNewRole(role)}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${newRole === role
                                            ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-white"
                                            : "border-white/10 bg-[#0B0D10] text-gray-400 hover:border-white/20"
                                            }`}
                                    >
                                        <span className="capitalize">{role}</span>
                                        {newRole === role && <span>✓</span>}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRole}
                                    className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
