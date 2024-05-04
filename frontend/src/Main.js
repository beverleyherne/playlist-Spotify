import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Login from "./components/LoginForm/Login";
import Profile from "./Pages/Profile/Profile";
import PlaylistPage from "./Pages/PlayListPage";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import PlaylistDetail from "./Pages/PlayListDetails";
import SignUp from "./components/SignUpForm/SignUpForm";

// Main component that will include Sidebar and Routes
const Main = () => {
  const location = useLocation();
  const showSidebar = !['/login', '/','/signup'].includes(location.pathname);

  return (
    <div className="flex bg-gray-900">
      {showSidebar && <SideBar />}
      <div className="flex-1 ">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/all-playlists" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
          <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
