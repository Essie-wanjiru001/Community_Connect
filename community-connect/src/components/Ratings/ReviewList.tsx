import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews/view', {
          params: { serviceId: 'example-service-id' }, // We need to Replace with actual service ID
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Review:</strong> {review.review}</p>
              <p><strong>User:</strong> {review.userId}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
