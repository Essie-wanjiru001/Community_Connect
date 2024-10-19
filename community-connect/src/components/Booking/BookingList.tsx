import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  fetchUserBookings,
  fetchArtisanBookings,
  updateBookingStatus,
} from '../redux/slices/bookingSlice';
import { useAuth } from '../../contexts/AuthContext';

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

const BookingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { bookings = [], loading, error } = useSelector(
    (state: RootState) => state.booking
  );

  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch user or artisan bookings based on user type
  useEffect(() => {
    if (user) {
      const fetchBookings = user.userType === 'artisan'
        ? fetchArtisanBookings
        : fetchUserBookings;

      dispatch(fetchBookings());
    }
  }, [dispatch, user]);

  // Handle booking status update
  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    dispatch(updateBookingStatus({ bookingId, status: newStatus }));
  };

  // Filter bookings based on the selected status
  const filteredBookings = bookings.filter(
    (booking: Booking) =>
      statusFilter === 'all' || booking.status === statusFilter
  );

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">Error: {error}</div>
    );
  }

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center mt-8">No bookings found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {/* Status Filter */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking: Booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{booking.service}</h3>
            <p className="text-gray-600 mb-2">
              Date: {new Date(booking.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">
              Time: {booking.startTime} - {booking.endTime}
            </p>
            <p className="text-gray-600 mb-2">
              Status:{' '}
              <span
                className={`font-semibold ${
                  booking.status === 'confirmed'
                    ? 'text-green-500'
                    : booking.status === 'cancelled'
                    ? 'text-red-500'
                    : booking.status === 'completed'
                    ? 'text-blue-500'
                    : 'text-yellow-500'
                }`}
              >
                {booking.status}
              </span>
            </p>
            <p className="text-gray-600 mb-4">
              Total Price: ${booking.totalPrice.toFixed(2)}
            </p>

            {/* Conditionally Render Consumer or Artisan Info */}
            {user?.userType === 'artisan' ? (
              <>
                <p className="text-gray-600 mb-2">
                  Customer: {booking.consumer.name}
                </p>
                {booking.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, 'confirmed')
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, 'cancelled')
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-600 mb-2">
                Service Provider: {booking.artisan.name}
              </p>
            )}

            {/* Mark as Completed Button */}
            {(user?.userType === 'artisan' ||
              booking.status === 'confirmed') && (
              <button
                onClick={() => handleStatusUpdate(booking._id, 'completed')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
