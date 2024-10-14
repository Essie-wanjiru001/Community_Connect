import axios from 'axios';

// Set base URL for backend API
const API_URL = 'http://localhost:5000/api'; // Point to backend server

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==============================
// Authentication APIs
// ==============================

// User login
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.response || error);
    throw error;
  }
};

// User registration
export const registerUser = async (registerData) => {
  try {
    const response = await api.post('/auth/register', registerData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response || error);
    throw error;
  }
};

// ==============================
// User Profile APIs
// ==============================

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile', error.response || error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.post('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile', error.response || error);
    throw error;
  }
};

// ==============================
// Booking APIs
// ==============================

// Fetch all bookings
export const fetchBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings', error.response || error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking', error.response || error);
    throw error;
  }
};

// Update an existing booking
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking', error.response || error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking', error.response || error);
    throw error;
  }
};

// ==============================
// Review APIs
// ==============================

// Fetch reviews for a specific service
export const fetchReviews = async (serviceId) => {
  try {
    const response = await api.get('/reviews/view', {
      params: { serviceId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews', error.response || error);
    throw error;
  }
};

// Submit a new review
export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews/add', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review', error.response || error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review', error.response || error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review', error.response || error);
    throw error;
  }
};

// ==============================
// Search APIs
// ==============================

// Search for items or providers
export const searchItems = async (query) => {
  try {
    const response = await api.get('/search', { params: query });
    return response.data;
  } catch (error) {
    console.error('Error searching items', error.response || error);
    throw error;
  }
};

// ==============================
// Chat APIs
// ==============================

// Fetch chat messages between two users
export const fetchChatMessages = async (senderId, receiverId) => {
  try {
    const response = await api.get('/chats', {
      params: { senderId, receiverId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages', error.response || error);
    throw error;
  }
};

// Send a new chat message
export const sendChatMessage = async (messageData) => {
  try {
    const response = await api.post('/chats', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message', error.response || error);
    throw error;
  }
};

export default api;