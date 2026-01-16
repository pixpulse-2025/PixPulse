import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Initial state
const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchMyOrders = createAsyncThunk(
    "orders/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/checkout/orders`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    "orders/fetchOrderById",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/checkout/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch order"
            );
        }
    }
);

export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/checkout`, orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create order"
            );
        }
    }
);

export const completeOrder = createAsyncThunk(
    "orders/completeOrder",
    async ({ orderId, paymentData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/checkout/complete/${orderId}`,
                paymentData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to complete order"
            );
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/checkout/orders/${orderId}/cancel`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to cancel order"
            );
        }
    }
);

// Orders slice
const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch My Orders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data || [];
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.data;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.data;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Complete Order
            .addCase(completeOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload.data;
                state.orders = [action.payload.data, ...state.orders];
            })

            // Cancel Order
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(
                    (order) => order._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            });
    },
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;
