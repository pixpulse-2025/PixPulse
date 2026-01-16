import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        reason: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.reason) {
            setError("Please select a reason");
            return;
        }

        if (!formData.description || formData.description.trim().length < 10) {
            setError("Please provide at least 10 characters of description");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await axios.post(`${API_URL}/reports/${artworkId}`, formData);

            // Success
            alert("Report submitted successfully. We will review it shortly.");
            onClose();
            setFormData({ reason: "", description: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="glass rounded-3xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Report Artwork
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {artworkTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Reason for Report <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl glass border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
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
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Additional Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please provide specific details about why you're reporting this artwork..."
                            rows="6"
                            maxLength="1000"
                            className="w-full px-4 py-3 rounded-xl glass border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 outline-none transition-colors text-gray-900 dark:text-white resize-none"
                            required
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Minimum 10 characters required
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formData.description.length}/1000
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            <strong>Note:</strong> False reports may result in account suspension.
                            We take all reports seriously and will review them within 24-48 hours.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
