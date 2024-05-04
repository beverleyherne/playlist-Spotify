// playListService.js
const db = require('../config/db'); // Adjust the path as necessary to point to where your db instance is exported

const createPlaylist = (name, description, userId, callback) => {
    const sql = `INSERT INTO Playlists (name, description, user_id) VALUES (?, ?, ?)`;
    db.run(sql, [name, description, userId], function(err) {
        callback(err, { id: this.lastID });
    });
};

const getPlaylistsByUser = (userId, callback) => {
    const sql = `SELECT * FROM Playlists WHERE user_id = ?`;
    db.all(sql, [userId], (err, playlists) => {
        callback(err, playlists);
    });
};

const getPlaylistById = (playlistId, callback) => {
    console.log('Fetching playlist from database:', playlistId);
    const sql = `SELECT * FROM Playlists WHERE id = ?`;
    db.get(sql, [playlistId], (err, playlist) => {
        callback(err, playlist);
    });
}
const getTracksByPlaylist = (playlistId, callback) => {
    const sql = `
        SELECT t.id, t.title, t.artist, t.duration, t.genre
        FROM Tracks t
        JOIN PlaylistTracks pt ON t.id = pt.track_id
        WHERE pt.playlist_id = ?
        ORDER BY pt."order"`;
    db.all(sql, [playlistId], (err, tracks) => {
        callback(err, tracks);
    });
}

const addTrackToPlaylist = (playlistId, trackId, order, callback) => {
    const sql = `INSERT INTO PlaylistTracks (playlist_id, track_id, "order") VALUES (?, ?, ?)`;
    db.run(sql, [playlistId, trackId, order], function(err) {
        callback(err, { id: this.lastID });
    });
}
const getTrackIdsByPlaylist = (playlistId, callback) => {
    const sql = `
        SELECT track_id
        FROM PlaylistTracks
        WHERE playlist_id = ?
        ORDER BY "order"`;
    db.all(sql, [playlistId], (err, rows) => {
        if (err) {
            console.error('Error fetching track IDs:', err);
            callback(err, null);
        } else {
            const trackIds = rows.map(row => row.track_id); // Extracting track_ids from the query results
            console.log('Track IDs fetched successfully:', trackIds);
            callback(null, trackIds);
        }
    });
}
const deletePlaylist = (playlistId, callback) => {
    const sql = `DELETE FROM Playlists WHERE id = ?`;
    db.run(sql, [playlistId], function(err) {
        callback(err);
    });
}
const deletePlaylistTrack = (playlistId, trackId, callback) => {
    const sql = `DELETE FROM PlaylistTracks WHERE playlist_id = ? AND track_id = ?`;
    db.run(sql, [playlistId, trackId], function(err) {
        callback(err);
    });
};



module.exports = {
    createPlaylist,
    getPlaylistsByUser,
    getPlaylistById,
    getTracksByPlaylist,
    addTrackToPlaylist,
    getTrackIdsByPlaylist,
    deletePlaylist,
    deletePlaylistTrack
};
