import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './../redux/store';

interface User {
  name: string;
  serviceType: string;
  location: string;
  availability: string;
  pricing: string;
}

const ProfileView = () => {
  const { user } = useSelector((state: RootState) => state.auth) as { user: User };

  return (
    <div>
      <h2>Profile Details</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Service Type:</strong> {user.serviceType}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Availability:</strong> {user.availability}</p>
          <p><strong>Pricing:</strong> {user.pricing}</p>
        </div>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default ProfileView;
