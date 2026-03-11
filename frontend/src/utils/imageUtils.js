const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getAvatarUrl = (avatarData, fallbackName = 'User') => {
    if (!avatarData) {
        return `https://ui-avatars.com/api/?name=${fallbackName}&background=0369a1&color=fff`;
    }
    if (avatarData.startsWith('http') || avatarData.startsWith('data:')) {
        return avatarData;
    }
    return `${BASE_URL}${avatarData}`;
};
