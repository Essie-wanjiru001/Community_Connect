import React, { useState } from 'react';
import axios from 'axios';

const BookingForm: React.FC = () => {
  const [serviceProvider, setServiceProvider] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/booking', { serviceProvider, date, userId: 'example-user-id' });
      setMessage('Booking successful!');
      console.log(response.data);  // Handles success
    } catch (error) {
      setMessage('Booking failed.');
      console.error(error);  // Handles error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Provider</label>
          <input
            type="text"
            value={serviceProvider}
            onChange={(e) => setServiceProvider(e.target.value)}
            placeholder="Enter service provider"
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit">Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;
