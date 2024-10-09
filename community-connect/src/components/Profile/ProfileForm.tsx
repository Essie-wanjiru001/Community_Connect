import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Profile</h2>
        <Formik
          initialValues={{
            name: '',
            serviceType: '',
            location: '',
            availability: '',
            pricing: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            serviceType: Yup.string().required('Service type is required'),
            location: Yup.string().required('Location is required'),
            availability: Yup.string().required('Availability is required'),
            pricing: Yup.string().required('Pricing is required'),
          })}
          onSubmit={(values) => {
            dispatch(updateProfile(values));
          }}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <Field name="name" type="text" className="w-full p-2 border rounded-md" />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block text-gray-700">Service Type</label>
              <Field name="serviceType" type="text" className="w-full p-2 border rounded-md" />
              <ErrorMessage name="serviceType" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block text-gray-700">Location</label>
              <Field name="location" type="text" className="w-full p-2 border rounded-md" />
              <ErrorMessage name="location" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block text-gray-700">Availability</label>
              <Field name="availability" type="text" className="w-full p-2 border rounded-md" />
              <ErrorMessage name="availability" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block text-gray-700">Pricing</label>
              <Field name="pricing" type="text" className="w-full p-2 border rounded-md" />
              <ErrorMessage name="pricing" component="div" className="text-red-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
              Save Profile
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ProfileForm;
