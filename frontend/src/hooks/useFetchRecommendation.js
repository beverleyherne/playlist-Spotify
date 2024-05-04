
import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecommendedSongs = (seedTracks, seedArtists, limit) => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem('spotifyToken');
        const response = await axios.post(
          'http://localhost:3000/spotify/search-tracks',
          { seedTracks, seedArtists, limit },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setRecommendedSongs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommended songs:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchRecommendedSongs();
  }, [seedTracks, seedArtists, limit]);

  return { recommendedSongs, loading, error };
};

export default useRecommendedSongs;