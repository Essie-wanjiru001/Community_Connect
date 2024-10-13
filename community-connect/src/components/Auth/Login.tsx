import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../services/api';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              // Attempt to log in user
              const userData = await loginUser(values);
              console.log('Login successful:', userData);
              
              // Dispatch login action to Redux
              dispatch(login(userData));
              
              // Navigate to the home page
              navigate('/home');
            } catch (error: any) {
              console.error('Error logging in user:', error);
              
              // Set error message for invalid credentials
              if (error.response && error.response.data) {
                setErrors({ email: error.response.data.message || 'Invalid credentials' });
              } else {
                setErrors({ email: 'Invalid credentials' });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
