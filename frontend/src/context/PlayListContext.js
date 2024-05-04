import React, { createContext, useContext, useState } from 'react';

const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState([]);

    const fetchPlaylists = async (userId) => {
        // Assume useFetchUserPlaylists is modified to return a function that fetches playlists
        const { playlists } = await useFetchUserPlaylists(userId)();
        setPlaylists(playlists);
    };

    const addPlaylist = (newPlaylist) => {
        setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    };

    return (
        <PlaylistContext.Provider value={{ playlists, fetchPlaylists, addPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
};
