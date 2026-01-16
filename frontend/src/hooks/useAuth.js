import { useSelector, useDispatch } from "react-redux";
import {
    login,
    register,
    logout,
    loadUser,
    updateProfile,
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    clearError,
    clearRegisterSuccess,
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

    return {
        // State
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login: (credentials) => dispatch(login(credentials)),
        register: (userData) => dispatch(register(userData)),
        logout: () => dispatch(logout()),
        loadUser: () => dispatch(loadUser()),
        updateProfile: (userData) => dispatch(updateProfile(userData)),
        clearError: () => dispatch(clearError()),
        clearRegisterSuccess: () => dispatch(clearRegisterSuccess()),
    };
};

export default useAuth;
