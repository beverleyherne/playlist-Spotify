import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/spotify'; // Adjust according to your actual API base URL

export const findTracks = async (query) => {
    console.log("findTracks called with query:", query);
    const token = localStorage.getItem("spotifyToken");
    console.log("token", token);

    if (!token) {
        throw new Error("No token found");
    }
    if (!query) {
        throw new Error("Search query must be provided");
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/search-tracks`, {
            params: { query }, // Pass the search query as a URL parameter
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // Assuming the response data structure contains the tracks information
    } catch (error) {
        console.error("Failed to search for tracks:", error);
        if (error.response) {
            // Include more detailed error handling based on the status codes
            switch (error.response.status) {
                case 401:
                    throw new Error("Unauthorized: Check if the access token is correct and valid.");
                case 400:
                    throw new Error("Bad Request: Check the syntax of the request.");
                case 404:
                    throw new Error("Not Found: The requested resource was not found.");
                default:
                    throw new Error("An error occurred: " + error.response.data.message);
            }
        } else {
            throw error; // In case of a network error or other unexpected issues
        }
    }
};

