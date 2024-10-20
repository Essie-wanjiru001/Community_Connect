import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { RootState, AppDispatch } from '../redux/store';
import { updateProfileAsync, fetchProfileAsync } from '../redux/slices/profileSlice';


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
  availability: { date: Date; startTime: string; endTime: string }[];
  servicePhotos?: string[];
  calendarSettings: {
    advanceBookings: number;
  };
}

interface BusinessProfile extends BaseProfile {
  businessCategory: string;
  openHours: string;
  availability: string;
  servicePhotos?: string[];
}

type Profile = ConsumerProfile | ArtisanProfile | BusinessProfile;

type ProfileFormData = {
  name: string;
  email: string;
  telephone: string;
  location: string;
  bio?: string;
  serviceType?: string;
  charges?: string;
  availability?: { date: Date | null; startTime: string; endTime: string }[];
  businessCategory?: string;
  openHours?: string;
  calendarSettings?: {
    advanceBookings: number;
  };
};


const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as { user: User | null });
  const { profile, loading, error } = useSelector((state: RootState) => state.profile as { profile: Profile | null, loading: boolean, error: string | null });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [servicePhotos, setServicePhotos] = useState<File[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchProfileAsync());
    }
  }, [user, navigate, dispatch]);

  if (!user) {
    return null; 
  }

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleServicePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setServicePhotos(Array.from(event.target.files));
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    telephone: Yup.string().required('Telephone is required'),
    location: Yup.string().required('Location is required'),
    bio: user.userType === 'consumer' ? Yup.string().required('Bio is required') : Yup.string().optional(),

    businessCategory: user.userType === 'business' ? Yup.string().required('Business category is required') : Yup.string().optional(),
    openHours: user.userType === 'business' ? Yup.string().required('Open hours are required') : Yup.string().optional(),

    serviceType: user.userType === 'artisan' ? Yup.string().required('Service type is required') : Yup.string().optional(),
    charges: user.userType === 'artisan' ? Yup.string().required('Charges are required') : Yup.string().optional(),
    
    availability: user.userType === 'artisan' 
      ? Yup.array().of(
          Yup.object().shape({
            date: Yup.date().required('Date is required'),
            startTime: Yup.string().required('Start time is required'),
            endTime: Yup.string()
              .required('End time is required')
              .test('is-greater', 'End time must be later than start time', function(value) {
                const { startTime } = this.parent;
                return startTime && value ? value > startTime : true;
              }),
          })
        ).min(1, 'At least one availability slot is required')
      : Yup.array().optional(),
    
    calendarSettings: user.userType === 'artisan'
      ? Yup.object().shape({
          advanceBookings: Yup.number()
            .min(1, 'Advance bookings must be at least 1 day')
            .max(365, 'Advance bookings cannot exceed 365 days')
            .required('Advance bookings is required'),
        })
      : Yup.object().optional(),
  });

  const handleSubmit = async (values: ProfileFormData) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'availability' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'calendarSettings' && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    servicePhotos.forEach((photo) => {
      formData.append('servicePhotos', photo);
    });

    try {
      await dispatch(updateProfileAsync(formData));
      navigate('/profile/view');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const initialValues: ProfileFormData = {
    name: user.name || '',
    email: user.email || '',
    telephone: (profile as BaseProfile)?.telephone || '',
    location: (profile as BaseProfile)?.location || '',
    bio: user.userType === 'consumer' ? (profile as ConsumerProfile)?.bio : undefined,
    serviceType: user.userType === 'artisan' ? (profile as ArtisanProfile)?.serviceType : undefined,
    charges: user.userType === 'artisan' ? (profile as ArtisanProfile)?.charges : undefined,
    
    businessCategory: user.userType === 'business' ? (profile as BusinessProfile)?.businessCategory : undefined,
    openHours: user.userType === 'business' ? (profile as BusinessProfile)?.openHours : undefined,
    
    availability: user.userType === 'artisan' ? (profile as ArtisanProfile)?.availability.map(slot => ({
      ...slot,
      date: new Date(slot.date)
    })) : undefined,
    calendarSettings: user.userType === 'artisan' ? {
      advanceBookings: (profile as ArtisanProfile)?.calendarSettings?.advanceBookings || 30,
    } : undefined,
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {profile ? 'Update Your Profile' : 'Create Your Profile'}
      </h2>
      
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}
      
      <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ values, setFieldValue }) => (
    <Form className="space-y-6">
      {/* Common fields for all user types */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <Field
          id="name"
          name="name"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Field
          id="email"
          name="email"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Telephone</label>
        <Field
          id="telephone"
          name="telephone"
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <ErrorMessage name="telephone" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <Field
          id="location"
          name="location"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      {/* Artisan-specific fields */}
      {user.userType === 'artisan' && (
              <>
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
                  <Field
                    id="serviceType"
                    name="serviceType"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="serviceType" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="charges" className="block text-sm font-medium text-gray-700">Charges</label>
                  <Field
                    id="charges"
                    name="charges"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="charges" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <FieldArray name="availability">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      {values.availability && values.availability.length > 0 ? (
                        values.availability.map((slot, index) => (
                          <div key={index} className="border rounded-md p-4 mb-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label htmlFor={`availability.${index}.date`} className="block text-sm font-medium text-gray-700">Date</label>
                                <DatePicker
                                  selected={slot.date}
                                  onChange={(date: Date | null) => setFieldValue(`availability.${index}.date`, date)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  dateFormat="MM, d, yyyy"
                                />
                                <ErrorMessage name={`availability.${index}.date`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              <div>
                                <label htmlFor={`availability.${index}.startTime`} className="block text-sm font-medium text-gray-700">Start Time</label>
                                <Field
                                  id={`availability.${index}.startTime`}
                                  name={`availability.${index}.startTime`}
                                  type="time"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <ErrorMessage name={`availability.${index}.startTime`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              <div>
                                <label htmlFor={`availability.${index}.endTime`} className="block text-sm font-medium text-gray-700">End Time</label>
                                <Field
                                  id={`availability.${index}.endTime`}
                                  name={`availability.${index}.endTime`}
                                  type="time"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <ErrorMessage name={`availability.${index}.endTime`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>
                            <button
                              type="button"
                              className="mt-2 text-red-600"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No availability slots added yet.</p>
                      )}
                      <button
                        type="button"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => push({ date: new Date(), startTime: '', endTime: '' })}
                      >
                        Add Availability Slot
                      </button>
                    </div>
                  )}
                </FieldArray>

                <div>
                  <label htmlFor="calendarSettings.advanceBookings" className="block text-sm font-medium text-gray-700">Advance Bookings (in days)</label>
                  <Field
                    id="calendarSettings.advanceBookings"
                    name="calendarSettings.advanceBookings"
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="calendarSettings.advanceBookings" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="servicePhotos" className="block text-sm font-medium text-gray-700">Upload Service Photos</label>
                  <input
                    id="servicePhotos"
                    name="servicePhotos"
                    type="file"
                    multiple
                    onChange={handleServicePhotosChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Upload Profile Photo</label>
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                onChange={handleProfilePhotoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileForm;
