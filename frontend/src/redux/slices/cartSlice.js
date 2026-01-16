import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Initial state
const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/cart`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ artworkId, licenseType }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/cart/${artworkId}`, {
                licenseType,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to cart"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/cart/${itemId}`);
            return { ...response.data, itemId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from cart"
            );
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/cart/clear`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear cart"
            );
        }
    }
);

// Cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.total = action.payload.total || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = [action.payload.data, ...state.items];
                state.total += action.payload.data.price;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from Cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const removedItem = state.items.find(item => item._id === action.payload.itemId);
                if (removedItem) {
                    state.total -= removedItem.price;
                }
                state.items = state.items.filter(item => item._id !== action.payload.itemId);
            })

            // Clear Cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.total = 0;
            });
    },
});

export const { clearError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
