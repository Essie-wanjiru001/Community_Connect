import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register</h2>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm password is required'),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const userData = await registerUser(values);
              console.log('Registration successful', userData);

              // Set the success message
              setSuccessMessage('Registration successful');

              // Navigate to the login page after successful registration
              navigate('/login');
            } catch (error) {
              console.error('Error during registration:', error);
              setErrors({ email: 'Registration failed' });
              setSuccessMessage(''); // Clear success message on error
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <Field name="name" type="text" className="w-full p-2 border rounded-md" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <Field name="email" type="email" className="w-full p-2 border rounded-md" />
                <ErrorMessage name="email" component="div" className="text-red-500" />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <Field name="password" type="password" className="w-full p-2 border rounded-md" />
                <ErrorMessage name="password" component="div" className="text-red-500" />
              </div>
              <div>
                <label className="block text-gray-700">Confirm Password</label>
                <Field name="confirmPassword" type="password" className="w-full p-2 border rounded-md" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              {successMessage && (
                <div className="text-green-500 mt-4">
                  {successMessage}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;