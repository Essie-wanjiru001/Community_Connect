import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateProfile } from './../redux/slices/authSlice';

const ProfileForm = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Create/Update Profile</h2>
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
          dispatch(updateProfile(values)); // Dispatch action to update profile
          console.log(values); // Handle profile submission
        }}
      >
        <Form>
          <div>
            <label>Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" />
          </div>

          <div>
            <label>Service Type</label>
            <Field name="serviceType" type="text" />
            <ErrorMessage name="serviceType" />
          </div>

          <div>
            <label>Location</label>
            <Field name="location" type="text" />
            <ErrorMessage name="location" />
          </div>

          <div>
            <label>Availability</label>
            <Field name="availability" type="text" />
            <ErrorMessage name="availability" />
          </div>

          <div>
            <label>Pricing</label>
            <Field name="pricing" type="text" />
            <ErrorMessage name="pricing" />
          </div>

          <button type="submit">Save Profile</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ProfileForm;
