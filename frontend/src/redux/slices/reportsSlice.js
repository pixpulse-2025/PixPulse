import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ======================
   ASYNC THUNKS
====================== */

// Report an artwork
export const reportArtwork = createAsyncThunk(
    "reports/reportArtwork",
    async ({ artworkId, reportData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${API_URL}/reports/${artworkId}`,
                reportData
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to submit report"
            );
        }
    }
);

// Get user's reports
export const getMyReports = createAsyncThunk(
    "reports/getMyReports",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/reports/my-reports`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch reports"
            );
        }
    }
);

// Get all reports (Admin only)
export const getAllReports = createAsyncThunk(
    "reports/getAllReports",
    async ({ status } = {}, { rejectWithValue }) => {
        try {
            const queryParams = status ? `?status=${status}` : "";
            const { data } = await axios.get(`${API_URL}/reports${queryParams}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch all reports"
            );
        }
    }
);

// Update report status (Admin only)
export const updateReportStatus = createAsyncThunk(
    "reports/updateReportStatus",
    async ({ reportId, updateData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(
                `${API_URL}/reports/${reportId}`,
                updateData
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update report"
            );
        }
    }
);

// Delete report (Admin only)
export const deleteReport = createAsyncThunk(
    "reports/deleteReport",
    async (reportId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${API_URL}/reports/${reportId}`);
            return { reportId, ...data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete report"
            );
        }
    }
);

/* ======================
   SLICE
====================== */

const reportsSlice = createSlice({
    name: "reports",
    initialState: {
        myReports: [],
        allReports: [],
        currentReport: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetReportsState: (state) => {
            state.myReports = [];
            state.allReports = [];
            state.currentReport = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Report Artwork
            .addCase(reportArtwork.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(reportArtwork.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentReport = action.payload.data;
                state.myReports.unshift(action.payload.data);
            })
            .addCase(reportArtwork.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Get My Reports
            .addCase(getMyReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyReports.fulfilled, (state, action) => {
                state.loading = false;
                state.myReports = action.payload.data;
            })
            .addCase(getMyReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Reports (Admin)
            .addCase(getAllReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.loading = false;
                state.allReports = action.payload.data;
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Report Status (Admin)
            .addCase(updateReportStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.allReports.findIndex(
                    (report) => report._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.allReports[index] = action.payload.data;
                }
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Report (Admin)
            .addCase(deleteReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allReports = state.allReports.filter(
                    (report) => report._id !== action.payload.reportId
                );
                state.myReports = state.myReports.filter(
                    (report) => report._id !== action.payload.reportId
                );
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

/* ======================
   SELECTORS
====================== */

export const selectMyReports = (state) => state.reports.myReports;
export const selectAllReports = (state) => state.reports.allReports;
export const selectCurrentReport = (state) => state.reports.currentReport;
export const selectReportsLoading = (state) => state.reports.loading;
export const selectReportsError = (state) => state.reports.error;
export const selectReportsSuccess = (state) => state.reports.success;

/* ======================
   ACTIONS & REDUCER
====================== */

export const { clearError, clearSuccess, resetReportsState } = reportsSlice.actions;
export default reportsSlice.reducer;
