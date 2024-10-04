import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings', { params: { userId: 'example-user-id' } });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking, index) => (
            <li key={index}>
              <p><strong>Service Provider:</strong> {booking.serviceProvider}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingList;
