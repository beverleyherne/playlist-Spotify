import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this as necessary
export const redirectToSpotifyLogin = () => {
    window.location.href = `${API_BASE_URL}/login`;
};
export const fetchUserProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const searchSong = async (query, accessToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/search`, { query }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data.searchResults;
    } catch (error) {
        console.error('Error searching for song:', error);
        throw error;
    }
};

// Function to refresh access token
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/refresh_token`, { refreshToken });
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;
    }
};
