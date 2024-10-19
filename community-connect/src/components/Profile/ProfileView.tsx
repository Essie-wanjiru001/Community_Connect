import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProfileAsync, selectProfile, selectProfileLoading, selectProfileError } from '../redux/slices/profileSlice';
import { Profile, User, ArtisanProfile } from '../../types';

const ProfileView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const profile = useSelector(selectProfile) as Profile | null;
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(fetchProfileAsync());
  }, [dispatch]);

  if (loading) return <div>Loading profile...</div>;

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: {error}</p>
        <Link to="/profile/edit" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Create Profile
        </Link>
      </div>
    );
  }

  if (!user || !profile) return <div>No profile data available.</div>;

  const isArtisanProfile = (p: Profile): p is ArtisanProfile =>
    'availability' in p && Array.isArray(p.availability);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium">Profile Information</h3>
        <p>{`${user.userType.charAt(0).toUpperCase()}${user.userType.slice(1)} profile`}</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd>{profile.telephone}</dd>
          </div>

          {isArtisanProfile(profile) && (
            <>
              {profile.serviceType && (
                <div>
                  <dt>Service Type</dt>
                  <dd>{profile.serviceType}</dd>
                </div>
              )}
              {profile.availability && profile.availability.length > 0 && (
                <div>
                  <dt>Availability</dt>
                  <dd>
                    {profile.availability.map((slot, index) => (
                      <div key={index}>
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ProfileView;
