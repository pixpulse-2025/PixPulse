import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getAllReports,
    updateReportStatus,
    deleteReport,
    selectAllReports,
    selectReportsLoading,
    selectReportsError,
    selectReportsSuccess,
    clearSuccess,
} from "../../redux/slices/reportsSlice";

const AdminReports = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectAllReports);
    const loading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);
    const success = useSelector(selectReportsSuccess);

    const [filter, setFilter] = useState("all");
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        dispatch(getAllReports());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setShowModal(false);
            setSelectedReport(null);
            setAdminNotes("");
            setNewStatus("");
            dispatch(clearSuccess());
        }
    }, [success, dispatch]);

    const handleUpdateStatus = (report) => {
        setSelectedReport(report);
        setAdminNotes(report.adminNotes || "");
        setNewStatus(report.status);
        setShowModal(true);
    };

    const handleSubmitUpdate = () => {
        if (!selectedReport) return;

        dispatch(
            updateReportStatus({
                reportId: selectedReport._id,
                updateData: {
                    status: newStatus,
                    adminNotes: adminNotes,
                },
            })
        );
    };

    const handleDelete = (reportId) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            dispatch(deleteReport(reportId));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
            reviewing: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
            resolved: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
            dismissed: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
        };
        return badges[status] || badges.pending;
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: "⏳",
            reviewing: "🔍",
            resolved: "✅",
            dismissed: "❌",
        };
        return icons[status] || icons.pending;
    };

    const filteredReports = reports.filter((report) => {
        if (filter === "all") return true;
        return report.status === filter;
    });

    const stats = {
        total: reports.length,
        pending: reports.filter((r) => r.status === "pending").length,
        reviewing: reports.filter((r) => r.status === "reviewing").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
        dismissed: reports.filter((r) => r.status === "dismissed").length,
    };

    if (loading && reports.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        📊 Reports Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and manage user-submitted artwork reports
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Reports</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reviewing</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.reviewing}</p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dismissed</p>
                        <p className="text-3xl font-bold text-gray-600">{stats.dismissed}</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="glass rounded-2xl p-2 mb-6 inline-flex gap-2 flex-wrap">
                    {["all", "pending", "reviewing", "resolved", "dismissed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${filter === status
                                    ? "bg-primary-600 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            {status}
                            {status !== "all" && (
                                <span className="ml-2 text-xs opacity-75">({stats[status]})</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="glass rounded-2xl p-6 mb-6 border-2 border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <span className="text-2xl">⚠️</span>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                {filteredReports.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {filter === "all" ? "No Reports" : `No ${filter} Reports`}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === "all"
                                ? "There are no reports to review."
                                : `There are no ${filter} reports.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div
                                key={report._id}
                                className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Artwork Preview */}
                                    <Link
                                        to={`/artwork/${report.artwork?._id}`}
                                        className="flex-shrink-0"
                                        target="_blank"
                                    >
                                        <img
                                            src={`http://localhost:5000${report.artwork?.previewUrl}`}
                                            alt={report.artwork?.title}
                                            className="w-full lg:w-48 h-32 object-cover rounded-xl"
                                            onError={(e) => {
                                                e.target.src =
                                                    "http://localhost:5000/uploads/placeholders/default-preview.png";
                                            }}
                                        />
                                    </Link>

                                    {/* Report Details */}
                                    <div className="flex-1 space-y-3">
                                        {/* Title & Status */}
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <Link
                                                    to={`/artwork/${report.artwork?._id}`}
                                                    target="_blank"
                                                    className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                                >
                                                    {report.artwork?.title || "Deleted Artwork"}
                                                </Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    By {report.artwork?.artist?.name || "Unknown Artist"}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusBadge(
                                                    report.status
                                                )}`}
                                            >
                                                {getStatusIcon(report.status)} {report.status}
                                            </span>
                                        </div>

                                        {/* Reporter Info */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">
                                                    Reported by:
                                                </span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                                    {report.reporter?.name} ({report.reporter?.email})
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300">
                                                    Date:
                                                </span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Reason */}
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-3">
                                            <span className="text-sm font-bold text-red-700 dark:text-red-400">
                                                Reason:
                                            </span>
                                            <span className="ml-2 text-sm text-red-600 dark:text-red-300">
                                                {report.reason}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                                Description:
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {report.description}
                                            </p>
                                        </div>

                                        {/* Admin Notes */}
                                        {report.adminNotes && (
                                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                                <p className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1">
                                                    Admin Notes:
                                                </p>
                                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                                    {report.adminNotes}
                                                </p>
                                                {report.resolvedBy && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                                        Resolved by {report.resolvedBy.name} on{" "}
                                                        {new Date(report.resolvedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-3">
                                            <button
                                                onClick={() => handleUpdateStatus(report)}
                                                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all"
                                            >
                                                Update Status
                                            </button>
                                            <Link
                                                to={`/artwork/${report.artwork?._id}`}
                                                target="_blank"
                                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                            >
                                                View Artwork
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(report._id)}
                                                className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Status Modal */}
            {showModal && selectedReport && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="glass rounded-3xl max-w-2xl w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    Update Report Status
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedReport.artwork?.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Status Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl glass border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Admin Notes
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this report..."
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl glass border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 outline-none transition-colors text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitUpdate}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating..." : "Update Report"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
