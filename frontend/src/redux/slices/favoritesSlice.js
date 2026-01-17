import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Initial state
const initialState = {
    favorites: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
    "favorites/fetchFavorites",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/favorites`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch favorites"
            );
        }
    }
);

export const addToFavorites = createAsyncThunk(
    "favorites/addToFavorites",
    async (artworkId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/favorites/${artworkId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to favorites"
            );
        }
    }
);

export const removeFromFavorites = createAsyncThunk(
    "favorites/removeFromFavorites",
    async (artworkId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/favorites/${artworkId}`);
            return { ...response.data, artworkId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from favorites"
            );
        }
    }
);

export const checkFavorite = createAsyncThunk(
    "favorites/checkFavorite",
    async (artworkId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/favorites/check/${artworkId}`);
            return { ...response.data, artworkId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to check favorite status"
            );
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    "favorites/toggleFavorite",
    async (artworkId, { getState, dispatch, rejectWithValue }) => {
        const state = getState();
        const favorites = state.favorites.favorites;
        const isFavorite = favorites.some((fav) => fav.artwork?._id === artworkId || fav.artwork === artworkId);

        try {
            if (isFavorite) {
                await dispatch(removeFromFavorites(artworkId)).unwrap();
                return { artworkId, removed: true };
            } else {
                const response = await dispatch(addToFavorites(artworkId)).unwrap();
                return { artworkId, added: true, data: response.data };
            }
        } catch (error) {
            return rejectWithValue(error || "Toggle favorite failed");
        }
    }
);

// Favorites slice
const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Favorites
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload.data || [];
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to Favorites
            .addCase(addToFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.loading = false;
                // Add if not already there
                const exists = state.favorites.some(fav => fav.artwork?._id === action.payload.data?.artwork?._id);
                if (!exists) {
                    state.favorites = [action.payload.data, ...state.favorites];
                }
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from Favorites
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter(
                    (fav) => (fav.artwork?._id || fav.artwork) !== action.payload.artworkId
                );
            });
    },
});

export const { clearError } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export const selectIsFavorite = (state, artworkId) =>
    state.favorites.favorites.some(fav => (fav.artwork?._id === artworkId || fav.artwork === artworkId));

export default favoritesSlice.reducer;
