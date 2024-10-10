import React, { useEffect, useState } from 'react';

interface ReviewListProps {
  serviceId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ serviceId }) => {
  interface Review {
    rating: number;
    review: string;
    userId: string;
  }
  
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Fetch reviews for the service (replace with actual fetch logic)
    setReviews([
      { rating: 5, review: 'Great service!', userId: 'John Doe' },
      { rating: 4, review: 'Good experience overall.', userId: 'Jane Smith' },
    ]);
  }, [serviceId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review, index) => (
              <li key={index} className="border-b pb-4">
                <p className="text-lg text-gray-700"><strong>Rating:</strong> {review.rating}</p>
                <p className="text-lg text-gray-700"><strong>Review:</strong> {review.review}</p>
                <p className="text-lg text-gray-700"><strong>User:</strong> {review.userId}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-700">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
