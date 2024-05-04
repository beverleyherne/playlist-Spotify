// src/utils/getCurrentUser.js
import {jwtDecode} from 'jwt-decode';

const getCurrentUser = () => {
    const token = localStorage.getItem('authToken');
    console.log(token,"token here here") // or 'appToken' based on your token storage key
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
         // Use jwtDecode to decode the JWT
        return decoded; // Contains user details like id, username, and email
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export default getCurrentUser;
