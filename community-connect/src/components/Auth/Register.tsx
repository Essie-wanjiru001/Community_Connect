import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/api';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register</h2>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '', userType: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm password is required'),
            userType: Yup.string().required('Please select a user type'),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const userData = await registerUser(values);
              console.log('Registration successful', userData);
            } catch (error) {
              console.error('Error during registration:', error);
              setErrors({ email: 'Registration failed' });
            }
            setSubmitting(false);
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
              <div>
                <label className="block text-gray-700">User Type</label>
                <Field as="select" name="userType" className="w-full p-2 border rounded-md">
                  <option value="">Select your role</option>
                  <option value="business">Business</option>
                  <option value="artisan">Artisan</option>
                  <option value="consumer">Consumer</option>
                </Field>
                <ErrorMessage name="userType" component="div" className="text-red-500" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
