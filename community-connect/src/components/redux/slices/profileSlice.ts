import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile } from '../../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'consumer' | 'artisan' | 'business';
}

interface BaseProfile {
  telephone: string;
  location: string;
  profilePhoto?: string;
}

interface ConsumerProfile extends BaseProfile {
  bio: string;
}

interface ArtisanProfile extends BaseProfile {
  serviceType: string;
  charges: string;
  availability: string;
  servicePhotos?: string[];
}

interface BusinessProfile extends BaseProfile {
  businessCategory: string;
  openHours: string;
  availability: string;
  servicePhotos?: string[];
}

type Profile = ConsumerProfile | ArtisanProfile | BusinessProfile;

interface ProfileState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfileAsync = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchUserProfile();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An unknown error occurred');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: FormData, { rejectWithValue }) => {
    try {
      const data = await updateUserProfile(profileData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An unknown error occurred');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.user = null;
      state.profile = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;

export const selectUser = (state: { profile: ProfileState }) => state.profile.user;
export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;