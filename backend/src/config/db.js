const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../db/myapp.db');

console.log("Database path:", dbPath); 

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialize the database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error when connecting to the database:', err);
        return;
    }
    console.log('Connected to the SQLite database.');

    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error('Error when creating Users table:', err);
        } else {
            console.log('Users table created');
        }
    });

    // Create Tracks table
    db.run(`
        CREATE TABLE IF NOT EXISTS Tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            duration INTEGER NOT NULL,
            genre TEXT
        );
    `, (err) => {
        if (err) {
            console.error('Error when creating Tracks table:', err);
        } else {
            console.log('Tracks table created');
        }
    });

    // Create Playlists table
    db.run(`
        CREATE TABLE IF NOT EXISTS Playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        );
    `, (err) => {
        if (err) {
            console.error('Error when creating Playlists table:', err);
        } else {
            console.log('Playlists table created');
        }
    });

    // Create PlaylistTracks junction table
    db.run(`
        CREATE TABLE IF NOT EXISTS PlaylistTracks (
            playlist_id INTEGER,
            track_id INTEGER,
            "order" INTEGER,
            PRIMARY KEY (playlist_id, track_id),
            FOREIGN KEY (playlist_id) REFERENCES Playlists(id),
            FOREIGN KEY (track_id) REFERENCES Tracks(id)
        );
    `, (err) => {
        if (err) {
            console.error('Error when creating PlaylistTracks table:', err);
        } else {
            console.log('PlaylistTracks table created');
        }
    });
});

module.exports = db;
