import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getMyReports,
    selectMyReports,
    selectReportsLoading,
    selectReportsError,
} from "../redux/slices/reportsSlice";

const MyReports = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectMyReports);
    const loading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        dispatch(getMyReports());
    }, [dispatch]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-yellow-500/10 text-yellow-400",
            reviewing: "bg-blue-500/10 text-blue-400",
            resolved: "bg-green-500/10 text-green-400",
            dismissed: "bg-gray-500/10 text-gray-400",
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

    if (loading && reports.length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        My Reports
                    </h1>
                    <p className="text-gray-400">
                        Track the status of your submitted artwork reports
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-2 mb-6 inline-flex gap-2">
                    {["all", "pending", "reviewing", "resolved", "dismissed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${filter === status
                                ? "bg-[#8B5CF6] text-white shadow-lg"
                                : "text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {status}
                            {status !== "all" && (
                                <span className="ml-2 text-xs opacity-75">
                                    ({reports.filter((r) => r.status === status).length})
                                </span>
                            )}
                        </button>
                    ))}
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
                {filteredReports.length === 0 ? (
                    <div className="bg-[#141821] border border-white/5 rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {filter === "all" ? "No Reports Yet" : `No ${filter} Reports`}
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {filter === "all"
                                ? "You haven't submitted any reports yet."
                                : `You don't have any ${filter} reports.`}
                        </p>
                        <Link
                            to="/explore"
                            className="inline-block px-6 py-3 bg-[#8B5CF6] text-white font-bold rounded-xl hover:bg-[#7C3AED] transition-all"
                        >
                            Browse Artworks
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div
                                key={report._id}
                                className="bg-[#141821] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Artwork Preview */}
                                    <Link
                                        to={`/artwork/${report.artwork?._id}`}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={`http://localhost:5000${report.artwork?.previewUrl}`}
                                            alt={report.artwork?.title}
                                            className="w-full lg:w-48 h-32 object-cover rounded-xl"
                                            onError={(e) => {
                                                e.target.src = "http://localhost:5000/uploads/placeholders/default-preview.png";
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
                                                    className="text-xl font-bold text-white hover:text-[#8B5CF6] transition-colors"
                                                >
                                                    {report.artwork?.title || "Deleted Artwork"}
                                                </Link>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Reported on {new Date(report.createdAt).toLocaleDateString()}
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

                                        {/* Reason */}
                                        <div>
                                            <span className="text-sm font-bold text-gray-300">
                                                Reason:
                                            </span>
                                            <span className="ml-2 text-sm text-gray-400">
                                                {report.reason}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p className="text-sm font-bold text-gray-300 mb-1">
                                                Description:
                                            </p>
                                            <p className="text-sm text-gray-400 line-clamp-2">
                                                {report.description}
                                            </p>
                                        </div>

                                        {/* Admin Notes (if resolved/dismissed) */}
                                        {report.adminNotes && (
                                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                                                <p className="text-sm font-bold text-violet-400 mb-1">
                                                    Admin Response:
                                                </p>
                                                <p className="text-sm text-violet-300">
                                                    {report.adminNotes}
                                                </p>
                                                {report.resolvedAt && (
                                                    <p className="text-xs text-violet-400/70 mt-2">
                                                        Resolved on {new Date(report.resolvedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mt-8">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">ℹ️</span>
                        <div>
                            <h3 className="font-bold text-white mb-2">
                                About Reports
                            </h3>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Reports are typically reviewed within 24-48 hours</li>
                                <li>• You'll be notified when your report status changes</li>
                                <li>• False reports may result in account restrictions</li>
                                <li>• You can only report each artwork once</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReports;
