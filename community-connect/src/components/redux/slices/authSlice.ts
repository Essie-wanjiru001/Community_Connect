import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '../../../services/api'; // Adjust this import to your actual API service

interface User {
  name?: string;
  serviceType?: string;
  location?: string;
  availability?: string;
  pricing?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // To track loading state
  error: string | null; // To track any errors
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Type guard to validate userData
function isUserData(userData: any): userData is Partial<User> {
  return (
    (userData.name === undefined || typeof userData.name === 'string') &&
    (userData.serviceType === undefined || typeof userData.serviceType === 'string') &&
    (userData.location === undefined || typeof userData.location === 'string') &&
    (userData.availability === undefined || typeof userData.availability === 'string') &&
    (userData.pricing === undefined || typeof userData.pricing === 'string')
  );
}

// Async thunk for updating the user profile
export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (userData: any, { rejectWithValue }) => {
    // Check if userData meets the required shape
    if (!isUserData(userData)) {
      return rejectWithValue('Invalid user data'); // Handle invalid data case
    }

    try {
      const response = await apiService.updateUserProfile(userData); // Make sure this API call is implemented
      console.log('API response:', response); // Debugging line
      return response.data; // Return the updated user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update profile'); // Handle error and return
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Handles the login action and sets the user and isAuthenticated status
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // Handles the logout action and clears the user data and isAuthenticated status
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for updateProfileAsync
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true; // Set loading to true
        state.error = null; // Clear any previous errors
      })
      // Handle fulfilled state for updateProfileAsync
      .addCase(updateProfileAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false; // Set loading to false
        if (state.user) {
          state.user = { ...state.user, ...action.payload }; // Update user data
        }
      })
      // Handle rejected state for updateProfileAsync
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false
        state.error = action.payload as string; // Set error message
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
