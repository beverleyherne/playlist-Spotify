import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { debounce } from "lodash"; // Ensure lodash is installed
import {
  addTrackToPlaylist,
  fetchPlaylistById,
  fetchTrackDetails,
  fetchTrackIdsByPlaylist,
  deleteTrackFromPlaylist
} from "../service/playListService";
import { findTracks } from "../service/spotifyService";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [deleteSuccessAlert, setDeleteSuccessAlert] = useState(false); // Add delete success alert
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchPlaylistAndTracks = async () => {
      try {
        const playlistResponse = await fetchPlaylistById(id);
        console.log("Playlist fetched:", playlistResponse);
        setPlaylist(playlistResponse);

        const trackIdsResponse = await fetchTrackIdsByPlaylist(id);
        console.log("Track IDs fetched:", trackIdsResponse);
        if (trackIdsResponse.length > 0) {
          const tracksDetails = await fetchTrackDetails(trackIdsResponse);
          console.log("Tracks fetched:", tracksDetails);
          setTracks(tracksDetails);
        } else {
          setTracks([]);
        }
      } catch (error) {
        console.error("Error fetching playlist and tracks:", error);
      }
    };

    fetchPlaylistAndTracks();
  }, [id, successAlert]);

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        console.log("Empty query, clearing recommendations");
        setRecommendations([]);
        return;
      }
      try {
        const recommendationsResponse = await findTracks(query);
        console.log("Recommendations received:", recommendationsResponse);
        setRecommendations(recommendationsResponse);
      } catch (error) {
        console.error("Error fetching track recommendations:", error);
      }
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      handleSearch(value);
    } else {
      setRecommendations([]);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const addTrack = async (trackId) => {
    try {
      const result = await addTrackToPlaylist(id, trackId);
      console.log("Server response:", result.message);
      setSuccessAlert(true);
      const newTimeoutId = setTimeout(() => {
        setSuccessAlert(false);
      }, 3000);
      setTimeoutId(newTimeoutId);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      alert(error.message);
    }
  };
  const deleteTrack = async (trackId) => {
    try {
      await deleteTrackFromPlaylist(id, trackId);
      console.log("Track deleted successfully");
      setDeleteSuccessAlert(true);
      const newTimeoutId = setTimeout(() => {
        setDeleteSuccessAlert(false);
      }, 3000);
      setTimeoutId(newTimeoutId);
      
      // Refresh playlist and tracks after deletion
      const playlistResponse = await fetchPlaylistById(id);
      console.log("Playlist fetched:", playlistResponse);
      setPlaylist(playlistResponse);
  
      const trackIdsResponse = await fetchTrackIdsByPlaylist(id);
      console.log("Track IDs fetched:", trackIdsResponse);
      if (trackIdsResponse.length > 0) {
        const tracksDetails = await fetchTrackDetails(trackIdsResponse);
        console.log("Tracks fetched:", tracksDetails);
        setTracks(tracksDetails);
      } else {
        setTracks([]);
      }
    } catch (error) {
      console.error("Error deleting track from playlist:", error);
      alert(error.message);
    }
  };
  


  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-lg mb-4">{playlist.description}</p>
          <h2 className="text-xl font-semibold mb-4">Tracks:</h2>
        </div>
        <div>
          <div className="flex flex-col items-center text-gray-500 mb-4">
            <p>Search for songs or episodes to add to this playlist:</p>
            <input
              type="text"
              placeholder="Search for songs or episodes"
              className="bg-gray-800 text-white rounded py-2 px-4 w-1/2 outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {recommendations.length > 0 && (
            <ul>
              {recommendations.map((rec) => (
                <li key={rec.id} className="flex items-center p-2 hover:bg-gray-600 cursor-pointer">
                  <img src={rec.album.images[0].url} alt={rec.album.name} className="w-10 h-10 mr-2 rounded-full" />
                  {rec.name} - {rec.artists.map((artist) => artist.name).join(", ")}
                  <button
                    className="ml-auto bg-black border border-white hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full"
                    onClick={() => addTrack(rec.id)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ul>
            {tracks.map((track) => (
              <li key={track.id} className="bg-gray-800 p-3 rounded-lg mb-2 flex justify-between items-center">
                <div className="flex items-center">
                  <img src={track.album.images[0].url} alt={track.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 className="text-white">{track.name}</h4>
                    <p className="text-gray-400">{track.artists.map((artist) => artist.name).join(", ")}</p>
                  </div>
                </div>
                <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteTrack(track.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {successAlert && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded-lg">Track added successfully!</div>
        </div>
      )}
           {deleteSuccessAlert && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded-lg">Track Deleted successfully!</div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
