import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

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
    // Handles profile update and merges the new data into the existing user data
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
