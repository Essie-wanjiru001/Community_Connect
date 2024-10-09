import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../services/api';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch();

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
              const userData = await loginUser(values);
              dispatch(login(userData));
              console.log('Login successful', userData);
            } catch (error) {
              console.error('Error logging in', error);
              setErrors({ email: 'Invalid credentials' });
            }
            setSubmitting(false);
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
