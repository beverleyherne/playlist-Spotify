import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetchUserPlaylists from '../../hooks/useFetchUserPlaylist';
import getCurrentUser from '../../utils/getCurrentUser';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = getCurrentUser();
    console.log(user,"user");
    const userId = getCurrentUser().id;
    const userName = getCurrentUser().name;
     // Retrieve user ID from utility function
    const { playlists, loading, error } = useFetchUserPlaylists(userId);

    // Toggle the sidebar open/close on small screens
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Calculate sidebar width dynamically based on screen size
    const sidebarWidth = window.innerWidth < 640 ? 'w-full' : 'w-64'; // Full width on very small screens

    return (
        <>
            {/* Button to toggle sidebar visibility on small screens */}
            <button
                className="fixed top-4 left-4 z-30 text-white block lg:hidden bg-gray-900 px-3 py-2 rounded"
                onClick={toggleSidebar}
            >
                Menu
            </button>

            {/* Sidebar */}
            <div className={`sticky top-0 h-screen ${isOpen ? sidebarWidth : 'w-0'} bg-gray-900 text-white flex flex-col overflow-hidden transition-width duration-300 ease-in-out lg:w-64`}>
                {/* Logo or App name */}
                <div className="px-5 py-4">
                    <h1 className="text-xl font-bold">Spotify</h1>
                </div>

                {/* Navigation */}
                <ul className="flex flex-col">
                    <Link to="/profile">
                        <li className="px-5 py-2 hover:bg-gray-700 cursor-pointer">Home</li>
                    </Link>
                </ul>

                {/* Playlists Section */}
                <div className="flex-1 overflow-y-auto px-5">
                    <p className="text-xs uppercase text-gray-400 mt-4 mb-2">Playlists</p>
                    <ul>
                        {loading ? (
                            <li>Loading playlists...</li>
                        ) : error ? (
                            <li>Error: {error}</li>
                        ) : (
                            playlists.slice(0, 10).map(playlist => (
                                <Link to={`/playlists/${playlist.id}`} onClick={toggleSidebar}>
                                <li key={playlist.id} className="py-1 hover:bg-gray-700 cursor-pointer">
                             {playlist.name}
                            </li>
                            </Link>
                            ))
                        )}
                        <li>
                            <Link to="/all-playlists">
                                <button className="mt-4 bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 w-full">
                                    View All Playlists
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* User Account */}
                <div className="px-5 py-3 border-t border-gray-800">
                    <div className="flex items-center">
                        <div className="rounded-full bg-gray-700 p-1 mr-3">
                            <span className="block w-6 h-6 bg-gray-500 rounded-full"></span> {/* Placeholder for user icon */}
                        </div>
                        <div>
                            <p className="text-sm">{userName}</p>
                            {/* <p className="text-xs text-gray-400">View Profile</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
