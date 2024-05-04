import axios from "axios";

const API_URL = "http://localhost:3000/auth"; // Replace with your backend API URL

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    console.log("User logged in successfully", response.data);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);  // Store token in localStorage
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('authToken');  // Remove token from localStorage when logging out
    }
  };
  
  const setSpotifytoken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem('appToken', token);  // Store app token in localStorage
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('appToken');  // Remove app token from localStorage when logging out
    }
  };


export { register, login, setAuthToken,setSpotifytoken };
