import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../../services/api';

interface ArtisanProfile {
  user: {
    _id: string;
    name: string;
  };
  name: string;
  serviceType: string;
  location: string;
  telephone: string;
  email: string;
  calendarSettings: {
    advanceBookings: number;
  };
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

interface Booking {
  _id: string;
  artisan: { _id: string; name: string };
  consumer: { _id: string; name: string };
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}

interface BookingState {
  artisanProfile: ArtisanProfile | null;
  availableSlots: AvailableSlot[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  artisanProfile: null,
  availableSlots: [],
  bookings: [],
  loading: false,
  error: null,
};

export const fetchArtisanProfile = createAsyncThunk(
  'booking/fetchArtisanProfile',
  async (artisanId: string, { rejectWithValue }) => {
    try {
      const response = await api.fetchArtisanProfiles();
      console.log('Full API Response:', response);

      if (!response || response.status !== 200) {
        console.error('API request failed:', response);
        return rejectWithValue('API request failed');
      }

      if (!response.data) {
        console.error('API response data is undefined');
        return rejectWithValue('API response data is undefined');
      }

      console.log('API Response data:', response.data);

      if (!Array.isArray(response.data)) {
        console.error('Unexpected API response structure:', response.data);
        return rejectWithValue('Unexpected API response structure');
      }

      const artisan = response.data.find((profile: ArtisanProfile) => profile.user._id === artisanId);
      
      if (!artisan) {
        console.error('Artisan not found:', artisanId);
        return rejectWithValue('Artisan not found');
      }

      return artisan;
    } catch (error) {
      console.error('Error fetching artisan profile:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async ({ artisanId, date }: { artisanId: string; date: string }) => {
    const response = await api.fetchAvailableTimeSlots(artisanId, date);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async ({ artisanId, date, slot, service }: { artisanId: string; date: string; slot: string; service: string }) => {
    const response = await api.createNewBooking(artisanId, date, slot, service);
    return response.data;
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async () => {
    const response = await api.fetchUserBookings();
    return response.data;
  }
);

export const fetchArtisanBookings = createAsyncThunk(
  'booking/fetchArtisanBookings',
  async () => {
    const response = await api.fetchArtisanBookings();
    return response.data;
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: string }) => {
    const response = await api.updateBookingStatus(bookingId, status);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtisanProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtisanProfile.fulfilled, (state, action: PayloadAction<ArtisanProfile>) => {
        state.loading = false;
        state.artisanProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchArtisanProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch artisan profile';
        console.error('Fetch artisan profile rejected:', action.payload);
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action: PayloadAction<AvailableSlot[]>) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch available slots';
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user bookings';
      })
      .addCase(fetchArtisanBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArtisanBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchArtisanBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch artisan bookings';
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(booking => booking._id === updatedBooking._id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update booking status';
      });
  },
});

export default bookingSlice.reducer;