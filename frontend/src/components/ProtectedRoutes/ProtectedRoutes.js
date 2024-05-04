import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = () => {
        console.log('Checking if user is authenticated', localStorage.getItem('authToken'));
        return localStorage.getItem('authToken') !== null;
    };

    if (!isAuthenticated()) {
        // User not authenticated, redirect to login
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
