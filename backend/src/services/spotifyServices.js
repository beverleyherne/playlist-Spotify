const axios = require("axios");
const querystring = require("querystring");
const config = require("../config/spotifyConfig"); // Ensure sensitive info like clientId and clientSecret are in environment variables

console.log(config);

exports.redirectToSpotifyLogin = (req, res) => {
  const scope =
    "user-read-private user-read-email playlist-modify-private user-read-recently-played"; // Added user-read-recently-played scope
  const redirectUri = encodeURIComponent(config.redirectUri);
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${config.clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
};

exports.handleSpotifyCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  const requestBody = {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;
  } catch (error) {
    console.error("Error handling Spotify callback:", error);
    res.status(500).json({ error: error.response.data });
  }
};
exports.handleSpotifyCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  const requestBody = {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    // Redirect to the frontend with tokens in the hash
    res.redirect(
      `http://localhost:3001/profile/#access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    console.error("Error handling Spotify callback:", error);
    res.status(500).json({ error: error.response.data });
  }
};

exports.createPlaylist = async (req, res) => {
  const { name, description, trackIds, accessToken } = req.body;

  try {
    const response = await axios.post(
      "https://api.spotify.com/v1/me/playlists",
      {
        name,
        description,
        public: false, // Set to true if you want the playlist to be public
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const playlistId = response.data.id;
    await addTracksToPlaylist(playlistId, trackIds, accessToken);
    res.json({ playlistId });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function addTracksToPlaylist(playlistId, trackIds, accessToken) {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackIds,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Optionally handle this response
  } catch (error) {
    console.error("Error adding tracks to playlist:", error);
    throw error;
  }
}

exports.fetchUserProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const requestBody = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    };
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token; // Returns new access token
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

exports.searchSong = async (query, accessToken) => {
  console.log("accessToken", accessToken);
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const searchResults = response.data.tracks.items;
    return searchResults;
  } catch (error) {
    console.error("Error searching for song:", error);
    throw new Error("Internal server error");
  }
};

exports.fetchRecentlyPlayedTracks = async (req, res) => {
  const accessToken = req.header("Authorization").split(" ")[1];

  // Extract the access token from Authorization header
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data.items); // Send the recently played tracks back to the client
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.findTracks = async (req, res) => {
  const query = req.query.query; // Now retrieving 'query' from URL parameters
  console.log(query, "query received");
  const accessToken = req.header("Authorization").split(" ")[1];
  console.log(accessToken, "access token received");

  try {
    const params = new URLSearchParams({
      q: query, // Use 'query' for searching tracks
      type: "track", // Looking up tracks
      limit: 20, // Limiting the number of results returned
    }).toString();

    const response = await axios.get(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data.tracks.items); // Sending back the search results to the client
  } catch (error) {
    console.error("Error searching for tracks:", error);
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};


exports.getTrackDetails = async (req, res) => {
    const trackIds = req.query.ids; // Retrieve track IDs from query parameters
    const accessToken = req.header("Authorization").split(" ")[1];

  
    if (!trackIds) {
        return res.status(400).json({ error: "No track IDs provided" });
    }

    try {
        const params = new URLSearchParams({ ids: trackIds }).toString();
        const response = await axios.get(`https://api.spotify.com/v1/tracks?${params}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json(response.data.tracks);
    } catch (error) {
        console.error('Error fetching track details:', error);
        res.status(error.response ? error.response.status : 500).json({ error: error.response ? error.response.data : "Internal server error" });
    }
};
