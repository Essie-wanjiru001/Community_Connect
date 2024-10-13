import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ProfileForm.css'; // Import your CSS file
import { useDispatch } from 'react-redux';
import { updateProfileAsync } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';

// Validation schema
const validationSchema = Yup.object().shape({
  userType: Yup.string().required('User type is required'),
  serviceType: Yup.string().when('userType', (userType: any, schema: Yup.StringSchema) => {
      return (userType === 'artisan' || userType === 'local business') 
          ? schema.required('Service type is required') 
          : schema.notRequired();
  }),
  location: Yup.string().required('Location is required'),
  availability: Yup.string().when('userType', (userType: any, schema: Yup.StringSchema) => {
      return (userType === 'artisan' || userType === 'local business') 
          ? schema.required('Availability is required') 
          : schema.notRequired();
  }),
  pricing: Yup.string().when('userType', (userType: any, schema: Yup.StringSchema) => {
      return (userType === 'artisan' || userType === 'local business') 
          ? schema.required('Pricing is required') 
          : schema.notRequired();
  }),
});

const ProfileForm: React.FC = () => {
  const initialValues = {
      userType: '',
      serviceType: '',
      location: '',
      availability: '',
      pricing: '',
  };

  const onSubmit = (values: typeof initialValues) => {
      console.log('Form data', values);
  };

  return (
      <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
      >
          {({ values, setFieldValue }) => (
              <Form>
                  <div>
                      <label htmlFor="userType">User Type</label>
                      <Field as="select" name="userType" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setFieldValue('userType', e.target.value);
                      }}>
                          <option value="">Select a user type</option>
                          <option value="artisan">Artisan</option>
                          <option value="local business">Local Business</option>
                          <option value="customer">Customer</option>
                      </Field>
                      <ErrorMessage name="userType" component="div" className="error" />
                  </div>

                  {(values.userType === 'artisan' || values.userType === 'local business') && (
                      <>
                          <div>
                              <label htmlFor="serviceType">Service Type</label>
                              <Field type="text" name="serviceType" />
                              <ErrorMessage name="serviceType" component="div" className="error" />
                          </div>
                          <div>
                              <label htmlFor="availability">Availability</label>
                              <Field type="text" name="availability" />
                              <ErrorMessage name="availability" component="div" className="error" />
                          </div>
                          <div>
                              <label htmlFor="pricing">Pricing</label>
                              <Field type="text" name="pricing" />
                              <ErrorMessage name="pricing" component="div" className="error" />
                          </div>
                      </>
                  )}

                  <div>
                      <label htmlFor="location">Location</label>
                      <Field type="text" name="location" />
                      <ErrorMessage name="location" component="div" className="error" />
                  </div>
                  <div className="button-container">
                  <button type="submit">Submit</button>
                  </div>
              </Form>
          )}
      </Formik>
  );
};

export default ProfileForm;
