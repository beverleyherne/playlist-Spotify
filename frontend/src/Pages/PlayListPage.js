import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import useFetchUserPlaylists from '../hooks/useFetchUserPlaylist';
import getCurrentUser from '../utils/getCurrentUser';
import { deletePlaylist } from '../service/playListService'; // Import the deletePlaylist function

const PlaylistPage = () => {
    const userId = getCurrentUser().id;
    const { playlists, loading, error, refetch } = useFetchUserPlaylists(userId); // Include refetch function from useFetchUserPlaylists
    const [menuOpen, setMenuOpen] = useState(null); // State to control menu visibility
    const [showDeletedModal, setShowDeletedModal] = useState(false); // State to control the visibility of the deleted modal
    const menuRef = useRef(null); // Ref for the menu
    console.log(playlists, "playlists");

    // Add event listener to handle clicks outside of the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null); // Close the menu if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    // Function to handle playlist deletion
    const handleDelete = async (playlistId) => {
        try {
            await deletePlaylist(playlistId); // Call the deletePlaylist function
            console.log(`Playlist with ID ${playlistId} deleted successfully`);
            setShowDeletedModal(true); // Show the deleted modal
            setTimeout(() => {
                setShowDeletedModal(false); // Hide the deleted modal after a certain duration
                refetch(); // Fetch the playlists again to refresh the list
            }, 1000); // 3000 milliseconds (3 seconds) timeout
        } catch (error) {
            console.error(`Failed to delete playlist with ID ${playlistId}:`, error);
            // You can handle errors here, such as displaying an error message to the user
        }
    };

    // Function to toggle the menu open/close
    const toggleMenu = (playlistId) => {
        setMenuOpen(menuOpen === playlistId ? null : playlistId);
    };

    return (
        <div className="bg-gray-900 text-white container mx-auto px-4 py-8  ">
            <h1 className="text-3xl font-bold mb-4">Your Playlists</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map(playlist => (
                    <div key={playlist.id} className="relative">
                        <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg flex flex-col">
                            <div className="p-4 flex-grow">
                                <h2 className="text-xl font-bold mb-2">{playlist.name}</h2>
                                <p className="text-sm">{playlist.description}</p>
                            </div>
                            <div className="p-4 flex justify-end items-center bg-gray-700">
                                <button onClick={() => toggleMenu(playlist.id)} className="focus:outline-none">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3 10a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {menuOpen === playlist.id && (
                            <div ref={menuRef} className="absolute top-full right-0 mt-1 w-48 bg-gray-500 rounded-lg shadow-lg z-10">
                                <Link to={`/playlists/${playlist.id}`}>
                                    <button className="block w-full px-4 py-2 text-white hover:bg-gray-700">View Playlist</button>
                                </Link>
                                <button className="block w-full px-4 py-2 text-white hover:bg-gray-700" onClick={() => handleDelete(playlist.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showDeletedModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-black">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-xl font-bold">Playlist Deleted</p>
                        <p>The playlist has been successfully deleted.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistPage;
