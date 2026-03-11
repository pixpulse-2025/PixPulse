import Report from "../models/Report.js";
import Artwork from "../models/Artwork.js";

/**
 * Submits a new violation report for a specific artwork.
 * @route POST /api/reports/:artworkId
 * @access Private
 */
export const reportArtwork = async (req, res) => {
    try {
        const { artworkId } = req.params;
        const { reason, description } = req.body;

        // Check if artwork exists
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        // Check if user already reported this artwork
        const existingReport = await Report.findOne({
            artwork: artworkId,
            reporter: req.user._id,
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this artwork",
            });
        }

        // Create report
        const report = await Report.create({
            artwork: artworkId,
            reporter: req.user._id,
            reason,
            description,
        });

        // Populate report data
        await report.populate([
            { path: "artwork", select: "title artist" },
            { path: "reporter", select: "name email" },
        ]);

        res.status(201).json({
            success: true,
            data: report,
            message: "Report submitted successfully. We will review it shortly.",
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves all reports submitted by the currently authenticated user.
 * @route GET /api/reports/my-reports
 * @access Private
 */
export const getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.user._id })
            .populate("artwork", "title previewUrl")
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves all reports in the system. Filterable by status.
 * Restricted to administrators.
 * @route GET /api/reports
 * @access Private/Admin
 */
export const getAllReports = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const reports = await Report.find(filter)
            .populate("artwork", "title artist previewUrl fileUrl")
            .populate("reporter", "name email")
            .populate("resolvedBy", "name")
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Updates the status and adds admin notes to a specific report.
 * Restricted to administrators.
 * @route PATCH /api/reports/:reportId
 * @access Private/Admin
 */
export const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, adminNotes } = req.body;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        report.status = status || report.status;
        report.adminNotes = adminNotes || report.adminNotes;

        if (status === "resolved" || status === "dismissed") {
            report.resolvedBy = req.user._id;
            report.resolvedAt = Date.now();
        }

        await report.save();

        await report.populate([
            { path: "artwork", select: "title artist" },
            { path: "reporter", select: "name email" },
            { path: "resolvedBy", select: "name" },
        ]);

        res.status(200).json({
            success: true,
            data: report,
            message: "Report updated successfully",
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Permanently deletes a report from the database.
 * Restricted to administrators.
 * @route DELETE /api/reports/:reportId
 * @access Private/Admin
 */
export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        await report.deleteOne();

        res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

/**
 * Retrieves all reports associated with a specific artwork.
 * Restricted to administrators.
 * @route GET /api/reports/artwork/:artworkId
 * @access Private/Admin
 */
export const getArtworkReports = async (req, res) => {
    try {
        const { artworkId } = req.params;

        const reports = await Report.find({ artwork: artworkId })
            .populate("reporter", "name email")
            .populate("resolvedBy", "name")
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};
