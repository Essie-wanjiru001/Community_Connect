import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAvailableTimeSlots, createNewBooking } from '../../../services/api';

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

interface BookingState {
  availableSlots: AvailableSlot[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  availableSlots: [],
  loading: false,
  error: null,
};

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async ({ artisanId, date }: { artisanId: string; date: string }) => {
    const response = await fetchAvailableTimeSlots(artisanId, date);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async ({ artisanId, date, slot }: { artisanId: string; date: string; slot: string }) => {
    const response = await createNewBooking(artisanId, date, slot);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch available slots';
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
        // You might want to update the state here (e.g., add the new booking to a list of user's bookings)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      });
  },
});

export default bookingSlice.reducer;