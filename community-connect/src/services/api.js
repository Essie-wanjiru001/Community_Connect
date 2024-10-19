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

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);
 //==================
    //Authentication APIs
    //==================

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
// Get user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteProfilePhoto = async () => {
  try {
    const response = await api.delete('/profile/photo');
    return response.data;
  } catch (error) {
    console.error('Error deleting profile photo:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteServicePhoto = async (photoIndex) => {
  try {
    const response = await api.delete(`/profile/photos/${photoIndex}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service photo:', error.response?.data || error.message);
    throw error;
  }
};

//export artisans profile
export const fetchArtisanProfiles = async () => {
  try {
    const response = await api.get('/profile/artisans');
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching artisan profiles:', error.response?.data || error.message);
    // Instead of throwing, return an object with error information
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || error.message || 'An unknown error occurred'
    };
  }
};


// ==============================
// Booking APIs
// ==============================

// Fetch all bookings
export const fetchAvailableTimeSlots = async (artisanId, date) => {
  try {
    const response = await api.get(`/bookings/available-slots/${artisanId}`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
};

export const createNewBooking = async (artisanId, date, slot, service) => {
  try {
    const response = await api.post('/bookings/create', {
      artisanId,
      date,
      slot,
      service
    });
    return response.data;
  } catch (error) {
    console.error('Error creating new booking:', error);
    throw error;
  }
};

export const fetchUserBookings = async () => {
  try {
    const response = await api.get('/bookings/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const fetchArtisanBookings = async () => {
  try {
    const response = await api.get('/bookings/artisan');
    return response.data;
  } catch (error) {
    console.error('Error fetching artisan bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
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
