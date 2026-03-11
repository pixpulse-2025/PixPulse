/**
 * @file walletSlice.js
 * @description Redux slice for wallet — balance, deposits, purchases, and transaction history.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
    balance: 0,
    transactions: [],
    loading: false,
    depositLoading: false,
    purchaseLoading: false,
    error: null,
    purchaseSuccess: false,
    lastOrder: null,
};

// Fetch wallet balance and recent transactions
export const fetchWalletBalance = createAsyncThunk(
    "wallet/fetchBalance",
    async (_, { rejectWithValue }) => {
        try {
            // Don't call API if there's no token
            const token = localStorage.getItem("token");
            if (!token) return rejectWithValue(null);

            const response = await axios.get(`${API_URL}/wallet/balance`);
            return response.data;
        } catch (error) {
            // Silently handle 401 — it's a token issue, not a wallet error
            if (error.response?.status === 401) {
                return rejectWithValue(null);
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch wallet balance"
            );
        }
    }
);

// Deposit test funds
export const depositFunds = createAsyncThunk(
    "wallet/deposit",
    async ({ amount, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/wallet/deposit`, { amount, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to deposit funds"
            );
        }
    }
);

// Purchase cart items with wallet
export const purchaseWithWallet = createAsyncThunk(
    "wallet/purchase",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/wallet/purchase`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Purchase failed"
            );
        }
    }
);

// Fetch transaction history
export const fetchTransactions = createAsyncThunk(
    "wallet/fetchTransactions",
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/wallet/transactions?page=${page}&limit=20`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch transactions"
            );
        }
    }
);

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearPurchaseSuccess: (state) => {
            state.purchaseSuccess = false;
            state.lastOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Balance
            .addCase(fetchWalletBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWalletBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.data.balance;
                state.transactions = action.payload.data.transactions;
            })
            .addCase(fetchWalletBalance.rejected, (state, action) => {
                state.loading = false;
                // Only set error if it's a real message (not null from auth issues)
                if (action.payload) {
                    state.error = action.payload;
                }
            })

            // Deposit
            .addCase(depositFunds.pending, (state) => {
                state.depositLoading = true;
                state.error = null;
            })
            .addCase(depositFunds.fulfilled, (state, action) => {
                state.depositLoading = false;
                state.balance = action.payload.data.balance;
                state.transactions = [action.payload.data.transaction, ...state.transactions];
            })
            .addCase(depositFunds.rejected, (state, action) => {
                state.depositLoading = false;
                state.error = action.payload;
            })

            // Purchase
            .addCase(purchaseWithWallet.pending, (state) => {
                state.purchaseLoading = true;
                state.error = null;
                state.purchaseSuccess = false;
            })
            .addCase(purchaseWithWallet.fulfilled, (state, action) => {
                state.purchaseLoading = false;
                state.balance = action.payload.data.newBalance;
                state.purchaseSuccess = true;
                state.lastOrder = action.payload.data.order;
            })
            .addCase(purchaseWithWallet.rejected, (state, action) => {
                state.purchaseLoading = false;
                state.error = action.payload;
            })

            // Fetch Transactions
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload.data;
            });
    },
});

export const { clearError, clearPurchaseSuccess } = walletSlice.actions;

export const selectWalletBalance = (state) => state.wallet.balance;
export const selectWalletTransactions = (state) => state.wallet.transactions;
export const selectWalletLoading = (state) => state.wallet.loading;
export const selectDepositLoading = (state) => state.wallet.depositLoading;
export const selectPurchaseLoading = (state) => state.wallet.purchaseLoading;
export const selectPurchaseSuccess = (state) => state.wallet.purchaseSuccess;
export const selectLastOrder = (state) => state.wallet.lastOrder;
export const selectWalletError = (state) => state.wallet.error;

export default walletSlice.reducer;
