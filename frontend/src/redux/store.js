import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artworkReducer from "./slices/artworkSlice";
import cartReducer from "./slices/cartSlice";
import favoritesReducer from "./slices/favoritesSlice";
import ordersReducer from "./slices/ordersSlice";
import reportsReducer from "./slices/reportsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        artwork: artworkReducer,
        cart: cartReducer,
        favorites: favoritesReducer,
        orders: ordersReducer,
        reports: reportsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled"],
            },
        }),
    devTools: import.meta.env.MODE !== "production",
});

export default store;
