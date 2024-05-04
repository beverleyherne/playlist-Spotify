import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecentlyPlayedTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentlyPlayed = async () => {
            setLoading(true);
            setError(null);

            try {
                const accessToken = localStorage.getItem('spotifyToken');
                const response = await axios.get('http://localhost:3000/spotify/recently-played', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                // Remove duplicates based on track ID
                const uniqueTracks = removeDuplicates(response.data);
                setTracks(uniqueTracks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recently played tracks:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchRecentlyPlayed();
    }, []); // Runs only once on component mount

    return { tracks, loading, error };
};

// Helper function to remove duplicates based on track ID
function removeDuplicates(tracks) {
    const seenIds = new Set();
    const uniqueTracks = tracks.filter(track => {
        if (!seenIds.has(track.track.id)) {
            seenIds.add(track.track.id);
            return true;
        }
        return false;
    });
    return uniqueTracks;
}

export default useRecentlyPlayedTracks;
