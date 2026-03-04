import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    reportArtwork,
    clearError,
    clearSuccess,
    selectReportsLoading,
    selectReportsError,
    selectReportsSuccess
} from "../redux/slices/reportsSlice";

const REPORT_REASONS = [
    "Copyright Infringement",
    "Inappropriate Content",
    "Spam",
    "Misleading Information",
    "Hate Speech",
    "Violence",
    "Other",
];

const ReportArtworkModal = ({ artworkId, artworkTitle, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);
    const success = useSelector(selectReportsSuccess);

    const [formData, setFormData] = useState({
        reason: "",
        description: "",
    });
    const [validationError, setValidationError] = useState(null);

    // Handle success
    useEffect(() => {
        if (success) {
            alert("Report submitted successfully. We will review it shortly.");
            setFormData({ reason: "", description: "" });
            onClose();
            dispatch(clearSuccess());
        }
    }, [success, onClose, dispatch]);

    // Clear errors when modal closes
    useEffect(() => {
        if (!isOpen) {
            dispatch(clearError());
            setValidationError(null);
            setFormData({ reason: "", description: "" });
        }
    }, [isOpen, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setValidationError(null);
        dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.reason) {
            setValidationError("Please select a reason");
            return;
        }

        if (!formData.description || formData.description.trim().length < 10) {
            setValidationError("Please provide at least 10 characters of description");
            return;
        }

        dispatch(reportArtwork({
            artworkId,
            reportData: formData
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#141821] border border-white/5 rounded-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            Report Artwork
                        </h2>
                        <p className="text-sm text-gray-400">
                            {artworkTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            Reason for Report <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#0B0D10] border border-white/10 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 outline-none transition-colors text-white"
                            required
                        >
                            <option value="">Select a reason...</option>
                            {REPORT_REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            Additional Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please provide specific details about why you're reporting this artwork..."
                            rows="6"
                            maxLength="1000"
                            className="w-full px-4 py-3 rounded-xl bg-[#0B0D10] border border-white/10 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 outline-none transition-colors text-white placeholder-gray-500 resize-none"
                            required
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                Minimum 10 characters required
                            </p>
                            <p className="text-xs text-gray-500">
                                {formData.description.length}/1000
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {(validationError || error) && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {validationError || error}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                        <p className="text-sm text-violet-400">
                            <strong>Note:</strong> False reports may result in account suspension.
                            We take all reports seriously and will review them within 24-48 hours.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/5 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportArtworkModal;
