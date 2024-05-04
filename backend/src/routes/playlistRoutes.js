// playListRoute.js
const express = require('express');
const router = express.Router();
const playListService = require('../services/playListService'); // Adjust the path as necessary

// Route to create a playlist
router.post('/create', (req, res) => {
    const { name, description, userId } = req.body;
    console.log(name, description, userId);
    playListService.createPlaylist(name, description, userId, (err, result) => {
        if (err) {
            res.status(500).json({ error: "Failed to create playlist" });
        } else {
            res.status(201).json({ message: "Playlist created", playlistId: result.id });
        }
    });
});

router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    playListService.getPlaylistsByUser(userId, (err, playlists) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve playlists" });
        } else {
            res.json({ playlists });
        }
    });
});




router.get('/:playlistId/tracks', (req, res) => {
    const { playlistId } = req.params;
    playListService.getTracksByPlaylist(playlistId, (err, tracks) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve tracks" });
        } else {
            res.json({ tracks });
        }
    });
});


// Correct order
router.get('/:playlistId', (req, res) => {
    console.log('Fetching playlist by ID:', req.params.playlistId);
    playListService.getPlaylistById(req.params.playlistId, (err, playlist) => {
        if (err) {
            console.error('Error fetching playlist:', err);
            res.status(500).json({ error: "Failed to retrieve playlist" });
        } else {
            res.json({ playlist });
        }
    });
});
router.get('/:playlistId/db', (req, res) => {
  
    const { playlistId } = req.params;
    console.log('Fetching playlist by ID hittin:', playlistId);
    playListService.getPlaylistById(playlistId, (err, trackIds) => {
        if (err) {
            console.error('Error fetching track IDs:', err);
            res.status(500).json({ error: "Failed to retrieve track IDs" });
        } else {
            res.json({ trackIds });
        }
    });
});

router.get('/:playlistId/track-ids', (req, res) => {
  
    const { playlistId } = req.params;
    playListService.getTrackIdsByPlaylist(playlistId, (err, trackIds) => {
        if (err) {
            console.error('Error fetching track IDs:', err);
            res.status(500).json({ error: "Failed to retrieve track IDs" });
        } else {
            res.json({ trackIds });
        }
    });
});


// Current
router.post('/playlist/:playlistId/add-track', (req, res) => {
    const { playlistId } = req.params;
    const { trackId, order } = req.body;
    playListService.addTrackToPlaylist(playlistId, trackId, order, (err, result) => {
        if (err) {
            res.status(500).json({ error: "Failed to add track to playlist", details: err.message });
        } else {
            res.status(201).json({ message: "Track added to playlist successfully", playlistTrackId: result.id });
        }
    });
});

router.delete('/:playlistId', (req, res) => {
    const { playlistId } = req.params;
    playListService.deletePlaylist(playlistId, (err) => {
        if (err) {
            res.status(500).json({ error: "Failed to delete playlist" });
        } else {
            res.json({ message: "Playlist deleted successfully" });
        }
    });
}
);

router.delete('/:playlistId/track/:trackId', (req, res) => {
    const { playlistId, trackId } = req.params;
    playListService.deletePlaylistTrack(playlistId, trackId, (err) => {
        if (err) {
            res.status(500).json({ error: "Failed to delete track from playlist" });
        } else {
            res.json({ message: "Track deleted from playlist successfully" });
        }
    });
});





module.exports = router;
