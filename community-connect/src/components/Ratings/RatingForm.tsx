import React, { useState } from 'react';
import axios from 'axios';

const RatingForm: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reviews/add', {
        rating,
        review,
        serviceId: 'example-service-id', // We need to Replace with actual service ID
        userId: 'example-user-id', // we need to Replace with actual user ID
      });
      setMessage('Review submitted successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Failed to submit review.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value="0">Select Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div>
        <label>Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
        ></textarea>
      </div>

      <button type="submit">Submit Review</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RatingForm;
