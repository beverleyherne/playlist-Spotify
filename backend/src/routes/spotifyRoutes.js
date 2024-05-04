const express = require("express");
const router = express.Router();
const spotifyService = require("../services/spotifyServices");
router.get("/login", spotifyService.redirectToSpotifyLogin);
router.get("/callback", spotifyService.handleSpotifyCallback);
router.post("/playlists", spotifyService.createPlaylist);
router.get("/tracks/details", spotifyService.getTrackDetails);




router.get('/recently-played', spotifyService.fetchRecentlyPlayedTracks); 
 // Add this route

 router.get("/search-tracks", spotifyService.findTracks); // Add this route


router.post("/search", async (req, res) => {
  const accessToken = req.header("Authorization").split(" ")[1];
  const query = req.body.query;

  try {
    const searchResults = await spotifyService.searchSong(query, accessToken);
    res.json({ searchResults });
  } catch (error) {
    console.error("Error searching for song:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", async (req, res) => {
  const accessToken = req.header("Authorization").split(" ")[1]; // Assuming the access token is passed as a Bearer token in the Authorization header
  try {
    const userProfile = await spotifyService.fetchUserProfile(accessToken);
    res.json(userProfile);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.post("/refresh_token", async (req, res) => {
  const refreshToken = req.body.refreshToken; // Assuming the refresh token is passed in the request body
  try {
    const newAccessToken = await spotifyService.refreshAccessToken(
      refreshToken
    );
    res.json({ access_token: newAccessToken });
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
});

module.exports = router;
