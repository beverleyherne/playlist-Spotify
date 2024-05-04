import { useState, useEffect } from 'react';
import { fetchUserPlaylists } from '../service/playListService';

const useFetchUserPlaylists = (userId) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = async () => {
        setLoading(true);
        try {
            const data = await fetchUserPlaylists(userId);
            setPlaylists(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                const data = await fetchUserPlaylists(userId);
                setPlaylists(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (userId) {
            loadPlaylists();
        }
    }, [userId]);

    return { playlists, loading, error, refetch }; // Include refetch function in the return object
};

export default useFetchUserPlaylists;
