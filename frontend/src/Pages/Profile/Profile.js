import React, { useEffect, useRef, useState } from "react";
import useSpotifyAuth from "../../hooks/useSpotifyAuthorization";
import useRecentlyPlayedTracks from "../../hooks/useFetchRecentlyPlayed";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { createPlaylist } from "../../service/playListService";
import getCurrentUser from "../../utils/getCurrentUser";
import { useNavigate } from 'react-router-dom';
import { data } from "autoprefixer";


// Modal component
const Modal = ({ isOpen, onClose }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const user_id = getCurrentUser().id;
  const navigate = useNavigate();

  console.log("User ID:", user_id);

  

// Part of your existing Modal component
// Part of your existing Modal component
const handleCreatePlaylist = async () => {
    try {
        const newPlaylist = await createPlaylist(playlistName, description, user_id)
        console.log("New Playlist:", newPlaylist);
        // console.log("Playlist created successfully:", playlistName);
        
        onClose(); // Close the modal on success
        navigate(`/playlists/${newPlaylist.playlistId}`);
        // navigate(`/playlists/${newPlaylist.id}`); // Navigate to the specific playlist page
    } catch (error) {
        console.error("Failed to create playlist:", error);
        alert("Failed to create playlist."); // Show error feedback
    }
};



  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center`}
    >
      <div className="bg-white p-4 rounded-md w-80">
        <h2 className="text-xl font-semibold mb-4">Create Playlist</h2>
        <div className="mb-4 border-b border-gray-300">
          <input
            type="text"
            className="p-2 w-full outline-none text-black" // Add text-black class
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
      
        </div>
        <div className="mb-4 border-b border-gray-300"> 
        <input
            type="text"
            className="p-2 w-full outline-none text-black" // Add text-black class
            placeholder="Enter Description Here" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleCreatePlaylist}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
const Profile = () => {
  const spotifyToken = useSpotifyAuth();
  const { tracks, loading, error } = useRecentlyPlayedTracks();
  const [openTrackId, setOpenTrackId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = (trackId) => {
    setOpenTrackId((prev) => (prev === trackId ? null : trackId));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!spotifyToken) {
    return <div>Redirecting to Spotify login...</div>;
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading tracks: {error.message}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center my-4 ml-4">
          <h1 className="text-4xl font-bold">Recently Played Tracks</h1>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
            onClick={openModal}
          >
            Create Playlist
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {tracks.map((track) => (
            <div
              key={track.track.id}
              className="bg-gray-800 rounded-lg p-4 shadow-lg relative"
            >
              <img
                src={track.track.album.images[0].url}
                alt={track.track.name}
                className="w-full h-auto rounded-lg mb-3"
              />
              <p className="text-center">{track.track.name}</p>
              <p className="text-center text-sm">
                by {track.track.artists.map((artist) => artist.name).join(", ")}
              </p>
              <div className="absolute bottom-2 right-2">
          
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Profile;
