import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { updateProfileAsync, fetchProfileAsync } from '../redux/slices/profileSlice';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'consumer' | 'artisan' | 'business';
}

interface Profile {
  telephone: string;
  location: string;
  bio?: string;
  serviceType?: string;
  charges?: string;
  availability?: string;
  businessCategory?: string;
  openHours?: string;
}

interface ProfileFormData extends Profile {
  name: string;
  email: string;
}

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as { user: User | null });
  const { profile, loading } = useSelector((state: RootState) => state.profile as { profile: Profile | null, loading: boolean });
  
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
    serviceType: user.userType === 'artisan' ? Yup.string().required('Service type is required') : Yup.string().optional(),
    charges: user.userType === 'artisan' ? Yup.string().required('Charges are required') : Yup.string().optional(),
    availability: (user.userType === 'artisan' || user.userType === 'business') ? Yup.string().required('Availability is required') : Yup.string().optional(),
    businessCategory: user.userType === 'business' ? Yup.string().required('Business category is required') : Yup.string().optional(),
    openHours: user.userType === 'business' ? Yup.string().required('Open hours are required') : Yup.string().optional(),
  });

  const handleSubmit = async (values: ProfileFormData) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });


    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    servicePhotos.forEach((photo, index) => {
      formData.append(`servicePhotos`, photo);
    });

    console.log('Form data being sent:');
    const formDataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log(JSON.stringify(formDataObj, null, 2));

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
    telephone: profile?.telephone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    serviceType: profile?.serviceType || '',
    charges: profile?.charges || '',
    availability: profile?.availability || '',
    businessCategory: profile?.businessCategory || '',
    openHours: profile?.openHours || '',
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {profile ? 'Update Your Profile' : 'Create Your Profile'}
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="space-y-6">
            <div className="space-y-4">
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

              {user.userType === 'consumer' && (
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <Field
                    id="bio"
                    name="bio"
                    as="textarea"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                  />
                  <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              )}

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

                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                    <Field
                      id="availability"
                      name="availability"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="availability" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </>
              )}

              {user.userType === 'business' && (
                <>
                  <div>
                    <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700">Business Category</label>
                    <Field
                      id="businessCategory"
                      name="businessCategory"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="businessCategory" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="openHours" className="block text-sm font-medium text-gray-700">Open Hours</label>
                    <Field
                      id="openHours"
                      name="openHours"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="openHours" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                    <Field
                      id="availability"
                      name="availability"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="availability" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              {(user.userType === 'artisan' || user.userType === 'business') && (
                <div>
                  <label htmlFor="servicePhotos" className="block text-sm font-medium text-gray-700">
                    Service/Product Photos
                  </label>
                  <input
                    id="servicePhotos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleServicePhotosChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Updating...' : (profile ? 'Update Profile' : 'Create Profile')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileForm;