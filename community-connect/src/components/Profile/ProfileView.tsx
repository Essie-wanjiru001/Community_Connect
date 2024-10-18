import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProfileAsync } from '../redux/slices/profileSlice';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'consumer' | 'artisan' | 'business';
}

interface BaseProfile {
  telephone: string;
  location: string;
  profilePhoto?: string;
}

interface ConsumerProfile extends BaseProfile {
  bio: string;
}

interface ArtisanProfile extends BaseProfile {
  serviceType: string;
  charges: string;
  availability: { day: string; startTime: string; endTime: string }[];
  servicePhotos?: string[];
  calendarSettings: {
    bookingNotice: number;
    maxAdvanceBooking: number;
    slotDuration: number;
  };
}

interface BusinessProfile extends BaseProfile {
  businessCategory: string;
  openHours: string;
  availability: string;
  servicePhotos?: string[];
}

type Profile = ConsumerProfile | ArtisanProfile | BusinessProfile;

const ProfileView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user as User | null);
  const profile = useSelector((state: RootState) => state.profile.profile as Profile | null);
  const loading = useSelector((state: RootState) => state.profile.loading);
  const error = useSelector((state: RootState) => state.profile.error);

  useEffect(() => {
    dispatch(fetchProfileAsync());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

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

  if (!user || !profile) {
    return <div className="text-center mt-10">No profile data available.</div>;
  }

  const isConsumerProfile = (profile: Profile): profile is ConsumerProfile => {
    return 'bio' in profile;
  };

  const isArtisanProfile = (profile: Profile): profile is ArtisanProfile => {
    return 'serviceType' in profile;
  };

  const isBusinessProfile = (profile: Profile): profile is BusinessProfile => {
    return 'businessCategory' in profile;
  };

  const renderProfileField = (label: string, value: string | undefined) => (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'Not provided'}</dd>
    </div>
  );

  const renderAvailability = (availability: { day: string; startTime: string; endTime: string }[]) => (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">Availability</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {availability.map((slot, index) => (
          <div key={index}>
            {slot.day}: {slot.startTime} - {slot.endTime}
          </div>
        ))}
      </dd>
    </div>
  );

  const renderCalendarSettings = (settings: { bookingNotice: number; maxAdvanceBooking: number; slotDuration: number }) => (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">Calendar Settings</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div>Booking Notice: {settings.bookingNotice} hours</div>
        <div>Max Advance Booking: {settings.maxAdvanceBooking} days</div>
        <div>Slot Duration: {settings.slotDuration} minutes</div>
      </dd>
    </div>
  );

  const renderServicePhotos = (photos: string[]) => (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">Service/Product Photos</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div className="flex flex-wrap gap-2">
          {photos.map((photo: string, index: number) => (
            <img key={index} src={photo} alt={`Service ${index + 1}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      </dd>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} profile</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {renderProfileField("Name", user.name)}
          {renderProfileField("Email", user.email)}
          {renderProfileField("Telephone", profile.telephone)}
          {renderProfileField("Location", profile.location)}
          
          {isConsumerProfile(profile) && renderProfileField("Bio", profile.bio)}
          
          {isArtisanProfile(profile) && (
            <>
              {renderProfileField("Service Type", profile.serviceType)}
              {renderProfileField("Charges", profile.charges)}
              {renderAvailability(profile.availability)}
              {renderCalendarSettings(profile.calendarSettings)}
            </>
          )}
          
          {isBusinessProfile(profile) && (
            <>
              {renderProfileField("Business Category", profile.businessCategory)}
              {renderProfileField("Open Hours", profile.openHours)}
              {renderProfileField("Availability", profile.availability)}
            </>
          )}
          
          {profile.profilePhoto && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Profile Photo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <img src={profile.profilePhoto} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
              </dd>
            </div>
          )}
          
          {(isArtisanProfile(profile) || isBusinessProfile(profile)) && 
           profile.servicePhotos && 
           profile.servicePhotos.length > 0 && 
           renderServicePhotos(profile.servicePhotos)}
        </dl>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link
          to="/profile/edit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileView;