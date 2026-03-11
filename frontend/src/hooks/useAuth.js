import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    login as loginAction,
    googleLogin as googleLoginAction,
    register as registerAction,
    logout as logoutAction,
    loadUser as loadUserAction,
    updateProfile as updateProfileAction,
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    clearError as clearErrorAction,
    clearRegisterSuccess as clearRegisterSuccessAction,
} from "../redux/slices/authSlice";

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const login = useCallback((credentials) => dispatch(loginAction(credentials)), [dispatch]);
    const googleLogin = useCallback((googleData) => dispatch(googleLoginAction(googleData)), [dispatch]);
    const register = useCallback((userData) => dispatch(registerAction(userData)), [dispatch]);
    const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
    const loadUser = useCallback(() => dispatch(loadUserAction()).unwrap(), [dispatch]);
    const updateProfile = useCallback((userData) => dispatch(updateProfileAction(userData)).unwrap(), [dispatch]);
    const clearError = useCallback(() => dispatch(clearErrorAction()), [dispatch]);
    const clearRegisterSuccess = useCallback(() => dispatch(clearRegisterSuccessAction()), [dispatch]);

    return {
        // State
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        googleLogin,
        register,
        logout,
        loadUser,
        updateProfile,
        clearError,
        clearRegisterSuccess,
    };
};

export default useAuth;
