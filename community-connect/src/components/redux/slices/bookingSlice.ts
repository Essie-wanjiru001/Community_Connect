import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../../services/api';

// Interfaces
interface User {
  _id: string;
  name: string;
}

interface ArtisanProfile {
  user: User;
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
  artisan: User;
  consumer: User;
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

// Initial State
const initialState: BookingState = {
  artisanProfile: null,
  availableSlots: [],
  bookings: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchArtisanProfile = createAsyncThunk(
  'booking/fetchArtisanProfile',
  async (artisanId: string, { rejectWithValue }) => {
    try {
      const response = await api.fetchArtisanProfiles();

      if (!response || response.status !== 200 || !response.data) {
        throw new Error('Failed to fetch artisan profiles');
      }

      const artisan = response.data.find((profile: ArtisanProfile) => profile.user._id === artisanId);
      if (!artisan) throw new Error('Artisan not found');

      return artisan;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async ({ artisanId, date }: { artisanId: string; date: string }, { rejectWithValue }) => {
    try {
      const response = await api.fetchAvailableTimeSlots(artisanId, date);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch available slots');
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async ({ artisanId, date, slot, service }: { artisanId: string; date: string; slot: string; service: string }, { rejectWithValue }) => {
    try {
      const response = await api.createNewBooking(artisanId, date, slot, service);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create booking');
    }
  }
);

export const fetchUserBookings = createAsyncThunk('booking/fetchUserBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchUserBookings();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch user bookings');
  }
});

export const fetchArtisanBookings = createAsyncThunk('booking/fetchArtisanBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchArtisanBookings();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch artisan bookings');
  }
});

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.updateBookingStatus(bookingId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update booking status');
    }
  }
);

// Booking Slice
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
      })
      .addCase(fetchArtisanProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAvailableSlots.fulfilled, (state, action: PayloadAction<AvailableSlot[]>) => {
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchArtisanBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.bookings = action.payload;
      })
      .addCase(fetchArtisanBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateBookingStatus.fulfilled, (state, action: PayloadAction<Booking>) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex((booking) => booking._id === updatedBooking._id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default bookingSlice.reducer;
