// Ensure 'tokens' matches the argument name
export const saveToken = (tokens) => {
    if (tokens && tokens.access && tokens.refresh) {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh); // Fixed: Use tokens.refresh
    } else {
        console.error("Invalid token object received:", tokens);
    }
};

export const clearToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

export const authFetch = async (url, options = {}) => {
    const token = getAccessToken();
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        // Space after 'Bearer' is vital
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Combine BASE_URL with the endpoint
    return fetch(`${BASE_URL}${url}`, {
        ...options,
        headers
    });
};