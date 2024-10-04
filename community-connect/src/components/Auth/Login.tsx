import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email address').required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={(values) => {
          console.log(values); // Handle login submission
        }}
      >
        <Form>
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
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
