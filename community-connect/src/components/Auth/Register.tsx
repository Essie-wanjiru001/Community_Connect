import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
            .required('Confirm password is required'),
        })}
        onSubmit={(values) => {
          console.log(values); // Simulate registration API call
        }}
      >
        <Form>
          <div>
            <label>Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" />
          </div>

          <div>
            <label>Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" />
          </div>

          <div>
            <label>Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" />
          </div>

          <div>
            <label>Confirm Password</label>
            <Field name="confirmPassword" type="password" />
            <ErrorMessage name="confirmPassword" />
          </div>

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
