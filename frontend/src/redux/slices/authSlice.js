/**
 * @file authSlice.js
 * @description Redux slice for managing user authentication state, tokens, and profile data.
 * Handles async transitions for login, registration, and session persistence.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL - update this based on your backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper to get the JWT token from browser localStorage.
 */
const getStoredToken = () => localStorage.getItem("token");

/**
 * Helper to get user profile data from browser localStorage.
 */
const getStoredUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

/**
 * Initial State for Authentication.
 * user: The current authenticated user object.
 * token: The current JWT.
 * isAuthenticated: Boolean flag for quick access check.
 * registerSuccess: Tracks the completion of a registration event.
 */
const initialState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    loading: false,
    error: null,
    registerSuccess: false,
};

// Async thunks for API calls
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            const { token, user } = response.data;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Set default axios header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async (googleData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/google`, googleData);
            const { token, user } = response.data;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Set default axios header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Google login failed"
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // Optional: Call logout endpoint if you have one
            // await axios.post(`${API_URL}/auth/logout`);

            // Clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Remove axios default header
            delete axios.defaults.headers.common["Authorization"];

            return null;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = getStoredToken();
            if (!token) {
                return rejectWithValue("No token found");
            }

            // Set axios header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const response = await axios.get(`${API_URL}/auth/me`);
            return response.data;
        } catch (error) {
            // Only clear token if unauthorized (401)
            // If it's a network error (no response), keep the token
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                delete axios.defaults.headers.common["Authorization"];
            }

            return rejectWithValue(
                error.response?.data?.message || "Failed to load user"
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/auth/profile`, userData);

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Profile update failed"
            );
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.registerSuccess = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.registerSuccess = false;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })

            // Google Login
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Still clear auth state even if API call fails
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearRegisterSuccess, setCredentials } = authSlice.actions;

/* ==========================================================================
   SELECTORS
   Memoized functions to extract specific pieces of authentication state.
   ========================================================================== */

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
