import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Make sure to import useNavigate

const useSpotifyAuth = () => {
    const [spotifyToken, setSpotifyToken] = useState(() => localStorage.getItem('spotifyToken'));
    const navigate = useNavigate();  // Use the useNavigate hook for navigation

    useEffect(() => {
        const loginSpotify = () => {
            window.location.href = 'http://localhost:3000/spotify/login';
        };

        if (!spotifyToken) {
            console.log('No Spotify token found, redirecting to Spotify login');
            loginSpotify();
        }
    }, [spotifyToken]);

    useEffect(() => {
        const checkForSpotifyToken = () => {
            console.log('Checking for Spotify token');
            const hash = window.location.hash.substring(1);
            const urlParams = new URLSearchParams(hash);
            const accessToken = urlParams.get('access_token');
            if (accessToken) {
                localStorage.setItem('spotifyToken', accessToken);
                setSpotifyToken(accessToken);
                window.history.pushState({}, document.title, window.location.pathname + window.location.search);
                navigate('/profile');  // Navigate to the profile page after setting the token
            }
        };

        checkForSpotifyToken();
    }, []); 

    return spotifyToken;
};

export default useSpotifyAuth;
