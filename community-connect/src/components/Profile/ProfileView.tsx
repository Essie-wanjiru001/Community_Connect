import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProfileView: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Profile Details</h2>
        {user ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Service Type:</strong> {user.serviceType}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Availability:</strong> {user.availability}</p>
            <p><strong>Pricing:</strong> {user.pricing}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No profile found</p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
