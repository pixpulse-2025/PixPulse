/**
 * @file artworkSlice.js
 * @description Redux slice for managing the state of artworks across the platform.
 * Handles fetching list of artworks, detailed views, uploads, and owner management.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Initial State for Artworks.
 * artworks: Array of artwork objects for the gallery/explore pages.
 * currentArtwork: Detailed object for the single artwork page.
 * uploadSuccess: Boolean flag to trigger redirect after upload.
 * pagination: Manages server-side pagination state.
 * filters: Holds the current viewing preference for categories, sorting, and search terms.
 */
const initialState = {
    artworks: [],
    myArtworks: [],
    currentArtwork: null,
    loading: false,
    error: null,
    uploadSuccess: false,
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    },
    filters: {
        category: "Visual Art",
        sortBy: "newest",
        search: "",
    },
};

// Async thunks
export const fetchArtworks = createAsyncThunk(
    "artwork/fetchArtworks",
    async ({ page = 1, limit = 12, category, subCategory, priceRange, sortBy, search }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                ...(category && category !== "all" && { category }),
                ...(subCategory && subCategory !== "all" && { subCategory }),
                ...(priceRange && priceRange !== "all" && { priceRange }),
                ...(sortBy && { sort: sortBy }),
                ...(search && { search }),
            });

            const response = await axios.get(`${API_URL}/artworks?${params}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch artworks"
            );
        }
    }
);

export const fetchArtworkById = createAsyncThunk(
    "artwork/fetchArtworkById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/artworks/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch artwork"
            );
        }
    }
);

export const uploadArtwork = createAsyncThunk(
    "artwork/uploadArtwork",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/artworks`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload artwork"
            );
        }
    }
);

export const fetchMyUploads = createAsyncThunk(
    "artwork/fetchMyUploads",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/artworks/my-uploads`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch your uploads"
            );
        }
    }
);

export const updateArtwork = createAsyncThunk(
    "artwork/updateArtwork",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/artworks/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update artwork"
            );
        }
    }
);

export const toggleArtworkVisibility = createAsyncThunk(
    "artwork/toggleVisibility",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/artworks/${id}/visibility`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to toggle visibility"
            );
        }
    }
);

export const deleteArtwork = createAsyncThunk(
    "artwork/deleteArtwork",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/artworks/${id}`);
            return { ...response.data, id };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete artwork"
            );
        }
    }
);

// Artwork slice
const artworkSlice = createSlice({
    name: "artwork",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentArtwork: (state) => {
            state.currentArtwork = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetUploadSuccess: (state) => {
            state.uploadSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Artworks
            .addCase(fetchArtworks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArtworks.fulfilled, (state, action) => {
                state.loading = false;
                state.artworks = action.payload.artworks || [];
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(fetchArtworks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Artwork by ID
            .addCase(fetchArtworkById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArtworkById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentArtwork = action.payload.data;
            })
            .addCase(fetchArtworkById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload Artwork
            .addCase(uploadArtwork.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadSuccess = false;
            })
            .addCase(uploadArtwork.fulfilled, (state, action) => {
                state.loading = false;
                state.uploadSuccess = true;
                state.artworks = [action.payload.data, ...state.artworks];
                state.myArtworks = [action.payload.data, ...state.myArtworks];
            })
            .addCase(uploadArtwork.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.uploadSuccess = false;
            })

            // Fetch My Uploads
            .addCase(fetchMyUploads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyUploads.fulfilled, (state, action) => {
                state.loading = false;
                state.myArtworks = action.payload.data || [];
            })
            .addCase(fetchMyUploads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Artwork
            .addCase(updateArtwork.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArtwork.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.artworks.findIndex(art => art._id === action.payload.data._id);
                if (index !== -1) {
                    state.artworks[index] = action.payload.data;
                }
                const myIndex = state.myArtworks.findIndex(art => art._id === action.payload.data._id);
                if (myIndex !== -1) {
                    state.myArtworks[myIndex] = action.payload.data;
                }
            })
            .addCase(updateArtwork.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Toggle Visibility
            .addCase(toggleArtworkVisibility.fulfilled, (state, action) => {
                const index = state.artworks.findIndex(art => art._id === action.payload.data._id);
                if (index !== -1) {
                    state.artworks[index] = action.payload.data;
                }
                const myIndex = state.myArtworks.findIndex(art => art._id === action.payload.data._id);
                if (myIndex !== -1) {
                    state.myArtworks[myIndex] = action.payload.data;
                }
            })

            // Delete Artwork
            .addCase(deleteArtwork.fulfilled, (state, action) => {
                state.artworks = state.artworks.filter(art => art._id !== action.payload.id);
                state.myArtworks = state.myArtworks.filter(art => art._id !== action.payload.id);
            });
    },
});

export const { setFilters, clearCurrentArtwork, clearError, resetUploadSuccess } = artworkSlice.actions;

/* ==========================================================================
   SELECTORS
   Functions to retrieve specific slices of the artwork state.
   ========================================================================== */

export const selectArtworks = (state) => state.artwork.artworks;
export const selectCurrentArtwork = (state) => state.artwork.currentArtwork;
export const selectArtworkLoading = (state) => state.artwork.loading;
export const selectArtworkError = (state) => state.artwork.error;
export const selectArtworkPagination = (state) => state.artwork.pagination;
export const selectArtworkFilters = (state) => state.artwork.filters;

export default artworkSlice.reducer;
