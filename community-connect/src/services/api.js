import axios from 'axios';

// Set base URL for backend API
const API_URL = 'http://localhost:5000/api'; // Point to backend server

// ==============================
// Booking APIs
// ==============================

// Fetch all bookings
export const fetchBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings', error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking', error);
    throw error;
  }
};

// Update an existing booking
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking', error);
    throw error;
  }
};

// ==============================
// Review APIs
// ==============================

// Fetch reviews for a specific service
export const fetchReviews = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/view`, {
      params: { serviceId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews', error);
    throw error;
  }
};

// Submit a new review
export const submitReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/add`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review', error);
    throw error;
  }
};

// ==============================
// Search APIs
// ==============================

// Search for items or providers
export const searchItems = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching items', error);
    throw error;
  }
};

// ==============================
// Chat APIs
// ==============================

// Fetch chat messages between two users
export const fetchChatMessages = async (senderId, receiverId) => {
  try {
    const response = await axios.get(`${API_URL}/chats`, {
      params: { senderId, receiverId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages', error);
    throw error;
  }
};

// Send a new chat message
export const sendChatMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/chats`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message', error);
    throw error;
  }
};

// ==============================
// User Profile APIs
// ==============================

// Fetch user profile
export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};

// ==============================
// Authentication APIs
// ==============================

// User login
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error)   
 {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// User registration
export const registerUser = async (registerData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, registerData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

