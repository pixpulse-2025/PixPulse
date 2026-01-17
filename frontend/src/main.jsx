/**
 * @file main.jsx
 * @description Entry point for the React frontend application.
 * Initializes the root element and wraps the App component with necessary providers.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import store from "./redux/store";
import { GOOGLE_CLIENT_ID } from "./config/google";

/**
 * Root Render sequence.
 * 1. GoogleOAuthProvider: Enables Google Login functionality.
 * 2. Provider: Connects the React application to the Redux store.
 * 3. BrowserRouter: Enables client-side routing.
 * 4. ThemeProvider: Manages the light/dark mode state via Context API.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
