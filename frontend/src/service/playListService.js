// src/services/playlistService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/playlist"; // Base URL looks correct


// Existing createPlaylist function
export const createPlaylist = async (name, description, userId) => {
  const token = localStorage.getItem("authToken"); // Ensure you are retrieving the correct token
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/create`,
      { name, description, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Playlist created successfully:", response.data);
    return response.data
  } catch (error) {
    console.error("Failed to create playlist:", error);
    throw error;
  }
};

export const fetchUserPlaylists = async (userId) => {
    const token = localStorage.getItem("authToken"); // Ensure you are retrieving the correct token
    if (!token) {
      throw new Error("Authentication token is missing");
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data.playlists; // Assuming the response has a playlists field
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      throw error;
    }
  };

  export const deletePlaylist = async (playlistId) => {
    const token = localStorage.getItem("authToken"); // Ensure you are retrieving the correct token
    if (!token) {
        throw new Error("Authentication token is missing");
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Playlist deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete playlist:", error);
        throw error;
    }
};

export const deleteTrackFromPlaylist = async (playlistId, trackId) => {
    const token = localStorage.getItem("authToken"); // Ensure you are retrieving the correct token
    if (!token) {
        throw new Error("Authentication token is missing");
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/${playlistId}/track/${trackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Track deleted from playlist successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete track from playlist:", error);
        throw error;
    }
};

 
  

  export const addTrackToPlaylist = async (playlistId, trackId, order = 0) => {
      const token = localStorage.getItem("authToken"); // Ensure you are retrieving the correct token
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    
      try {
        const response = await axios.post(
          `${API_BASE_URL}/playlist/${playlistId}/add-track`,
          { trackId, order },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Track added to playlist successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to add track to playlist:", error);
        throw error;
      }
  };


  export const fetchTrackDetails = async (trackIds) => {
    const idsParam = trackIds.join(',');
    const token = localStorage.getItem("spotifyToken");

    if (!token) {
      throw new Error("Spotify access token is missing");
    }

    try {
      const response = await axios.get(`http://localhost:3000/spotify/tracks/details?ids=${idsParam}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Track details fetched successfully for multiple tracks:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch track details:", error);
      throw error;
    }
};



  export const fetchTrackIdsByPlaylist = async (playlistId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/${playlistId}/track-ids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data.trackIds;  // Assuming response structure has a trackIds field
    } catch (error) {
      console.error("Failed to fetch track IDs:", error);
      throw error;
    }
};


export const fetchPlaylistById = async (playlistId) => {
    console.log("Fetching playlist by ID:", playlistId);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    
      try {
        console.log("Fetching playlist to route:", `${API_BASE_URL}/${playlistId}/db` );
        const response = await axios.get(`${API_BASE_URL}/${playlistId}/db`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
        console.log("Playlist fetched successfully:", response.data.playlist);
        return response.data;  // Ensure this matches the server response structure
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
        throw error;
      }
  };