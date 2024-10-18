import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchAvailableSlots, createBooking } from '../redux/slices/bookingSlice';
import { RootState, AppDispatch } from '../redux/store';

interface BookingFormValues {
  date: string;
  slot: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

// Define the structure of the booking slice in the Redux store
interface BookingState {
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

const BookingForm: React.FC = () => {
  const { artisanId } = useParams<{ artisanId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { availableSlots, loading, error } = useSelector((state: RootState) => state.booking as BookingState);

  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (selectedDate && artisanId) {
      dispatch(fetchAvailableSlots({ artisanId, date: selectedDate }));
    }
  }, [dispatch, artisanId, selectedDate]);

  const initialValues: BookingFormValues = {
    date: '',
    slot: '',
  };

  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    slot: Yup.string().required('Time slot is required'),
  });

  const handleSubmit = async (values: BookingFormValues) => {
    if (artisanId) {
      await dispatch(createBooking({ artisanId, ...values }));
      // Handle success (e.g., show a success message, redirect to bookings list)
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <Field
                type="date"
                id="date"
                name="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue('date', e.target.value);
                  setSelectedDate(e.target.value);
                }}
              />
              <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
            </div>

            {selectedDate && (
              <div>
                <label htmlFor="slot" className="block text-sm font-medium text-gray-700">Time Slot</label>
                <Field
                  as="select"
                  id="slot"
                  name="slot"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map((slot: TimeSlot, index: number) => (
                    <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="slot" component="div" className="text-red-500 text-sm" />
              </div>
            )}

            {loading && <div>Loading available slots...</div>}
            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              Book Appointment
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;