import React, { useEffect, useState } from 'react';

const BookingList = () => {
  interface Booking {
    serviceProvider: string;
    date: string;
  }
  
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Fetch bookings from the backend
    setBookings([
      { serviceProvider: 'John Doe', date: '2023-10-15' },
      { serviceProvider: 'Jane Smith', date: '2023-10-20' },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Your Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking, index) => (
              <li key={index} className="border-b pb-4">
                <p className="text-lg text-gray-700"><strong>Service Provider:</strong> {booking.serviceProvider}</p>
                <p className="text-lg text-gray-700"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-700">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingList;
