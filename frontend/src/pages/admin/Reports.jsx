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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // State for modal actions
    const [adminAction, setAdminAction] = useState({
        status: "",
        notes: ""
    });

    useEffect(() => {
        dispatch(getAllReports());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setShowModal(false);
            setSelectedReport(null);
            setAdminAction({ status: "", notes: "" });
            dispatch(clearSuccess());
        }
    }, [success, dispatch]);

    const handleOpenModal = (report) => {
        setSelectedReport(report);
        setAdminAction({
            status: report.status,
            notes: report.adminNotes || ""
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReport(null);
        setAdminAction({ status: "", notes: "" });
    };

    const handleUpdateStatus = () => {
        if (!selectedReport) return;

        dispatch(
            updateReportStatus({
                reportId: selectedReport._id,
                updateData: {
                    status: adminAction.status,
                    adminNotes: adminAction.notes,
                },
            })
        );
    };

    const handleDelete = (reportId) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            dispatch(deleteReport(reportId));
        }
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            pending: "bg-yellow-500/10 text-yellow-500",
            reviewed: "bg-blue-500/10 text-blue-500",
            resolved: "bg-green-500/10 text-green-500",
            dismissed: "bg-gray-500/10 text-gray-400",
        };
        return colors[status] || colors.pending;
    };

    const filteredReports = reports.filter((report) => {
        // Filter by status
        if (filter !== "all" && report.status !== filter) return false;

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const reporterName = report.reporter?.name?.toLowerCase() || "";
            const reason = report.reason?.toLowerCase() || "";
            const targetTitle = (report.targetId?.title || report.targetId?.name || "").toLowerCase();

            return reporterName.includes(term) || reason.includes(term) || targetTitle.includes(term);
        }

        return true;
    });

    if (loading && reports.length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading reports...</p>
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
                            Report Management
                        </h1>
                        <p className="text-gray-400">
                            Handle user reports and content moderation
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Total Reports</p>
                        <p className="text-2xl font-bold text-white">{filteredReports.length}</p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Pending Action</p>
                        <p className="text-2xl font-bold text-yellow-500">
                            {reports.filter(r => r.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Resolved</p>
                        <p className="text-2xl font-bold text-green-500">
                            {reports.filter(r => r.status === 'resolved').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['all', 'pending', 'reviewed', 'resolved', 'dismissed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filter === status
                                        ? "bg-[#8B5CF6] text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Search reports by reporter, reason, or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#0B0D10] text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent placeholder-gray-500"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 text-red-500">
                            <span className="text-2xl">⚠️</span>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reported Item</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reason</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reporter</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {report.targetModel === 'Artwork' && report.targetId && (
                                                        <img
                                                            src={`http://localhost:5000${report.targetId.previewUrl || report.targetId.fileUrl}`}
                                                            alt="Preview"
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-white">
                                                            {report.targetModel === 'User'
                                                                ? report.targetId?.name
                                                                : report.targetId?.title || 'Unknown Item'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">ID: {report.targetId?._id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                                                    {report.targetModel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-300">{report.reason}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-white">
                                                        {report.reporter?.name || "Anonymous"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleOpenModal(report)}
                                                    className="text-[#8B5CF6] hover:text-white font-medium text-sm"
                                                >
                                                    Review
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(report._id)}
                                                    className="text-red-500 hover:text-red-400 font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                            No reports found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Review Modal */}
                {showModal && selectedReport && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Review Report</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Report Details */}
                                <div className="bg-[#0B0D10] rounded-xl p-4 border border-white/5">
                                    <h3 className="font-bold text-white mb-2">Report Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">Reporter</p>
                                            <p className="font-medium text-white">{selectedReport.reporter?.name || "Anonymous"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Date</p>
                                            <p className="font-medium text-white">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400">Reason</p>
                                            <p className="font-medium text-white">{selectedReport.reason}</p>
                                        </div>
                                        {selectedReport.details && (
                                            <div className="col-span-2">
                                                <p className="text-gray-400">Additional Details</p>
                                                <p className="font-medium text-white">{selectedReport.details}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Target Content Preview */}
                                <div className="bg-[#0B0D10] rounded-xl p-4 border border-white/5">
                                    <h3 className="font-bold text-white mb-4">Reported Content</h3>
                                    {selectedReport.targetModel === 'Artwork' ? (
                                        <div className="flex gap-4">
                                            <div className="w-1/3">
                                                {selectedReport.targetId && (
                                                    <img
                                                        src={`http://localhost:5000${selectedReport.targetId.previewUrl || selectedReport.targetId.fileUrl}`}
                                                        alt="Content"
                                                        className="w-full rounded-lg"
                                                        onError={(e) => {
                                                            e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white text-lg">{selectedReport.targetId?.title}</h4>
                                                <p className="text-gray-400 text-sm mt-1">{selectedReport.targetId?.description}</p>
                                                <div className="flex gap-2 mt-4">
                                                    <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                                                        {selectedReport.targetId?.category}
                                                    </span>
                                                    <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                                                        {selectedReport.targetId?.priceType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                                                {selectedReport.targetId?.name?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{selectedReport.targetId?.name}</h4>
                                                <p className="text-gray-400">{selectedReport.targetId?.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Form */}
                                <div>
                                    <h3 className="font-bold text-white mb-4">Take Action</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Update Status
                                            </label>
                                            <select
                                                value={adminAction.status}
                                                onChange={(e) => setAdminAction({ ...adminAction, status: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg bg-[#0B0D10] border border-white/10 text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                                            >
                                                <option value="pending">Pending Review</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="dismissed">Dismissed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                value={adminAction.notes}
                                                onChange={(e) => setAdminAction({ ...adminAction, notes: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg bg-[#0B0D10] border border-white/10 text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-24"
                                                placeholder="Add notes about the action taken..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    className="btn-primary px-6 py-2 text-white rounded-lg font-medium transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
