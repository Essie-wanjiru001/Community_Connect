import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface BookingState {
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

const persistKey = 'bookingFormData'; // Key for localStorage

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract artisanId from the URL
  const navigate = useNavigate(); // For navigation after booking
  const dispatch = useDispatch<AppDispatch>();
  const { availableSlots, loading, error } = useSelector(
    (state: RootState) => state.booking as BookingState
  );

  const [selectedDate, setSelectedDate] = useState<string>('');

  // Retrieve persisted form data from localStorage
  const getPersistedFormData = (): BookingFormValues => {
    const savedData = localStorage.getItem(persistKey);
    return savedData ? JSON.parse(savedData) : { date: '', slot: '' };
  };

  const initialValues: BookingFormValues = getPersistedFormData();

  useEffect(() => {
    if (initialValues.date) {
      setSelectedDate(initialValues.date); // Pre-set date if available
    }
    if (selectedDate && id) {
      dispatch(fetchAvailableSlots({ artisanId: id, date: selectedDate }));
    }
  }, [dispatch, id, selectedDate, initialValues.date]);

  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    slot: Yup.string().required('Time slot is required'),
  });

  const handleFormChange = (values: BookingFormValues) => {
    localStorage.setItem(persistKey, JSON.stringify(values)); // Persist data on change
  };

  const handleSubmit = async (values: BookingFormValues) => {
    if (id) {
      try {
        await dispatch(createBooking({ artisanId: id, ...values })).unwrap();
        alert('Booking successful!');
        localStorage.removeItem(persistKey); // Clear persisted data
        navigate('/booking/list'); // Redirect to booking list
      } catch (err) {
        console.error('Booking failed:', err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        onChange={handleFormChange} // Track changes to persist data
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            {/* Date Field */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Field
                type="date"
                id="date"
                name="date"
                autoComplete="off"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue('date', e.target.value);
                  setSelectedDate(e.target.value);
                  handleFormChange({ ...values, date: e.target.value }); // Persist on change
                }}
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Time Slot Field */}
            {selectedDate && (
              <div>
                <label htmlFor="slot" className="block text-sm font-medium text-gray-700">
                  Time Slot
                </label>
                <Field
                  as="select"
                  id="slot"
                  name="slot"
                  autoComplete="off"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('slot', e.target.value);
                    handleFormChange({ ...values, slot: e.target.value }); // Persist on change
                  }}
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map((slot: TimeSlot, index: number) => (
                    <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="slot"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            {/* Loading and Error Messages */}
            {loading && <div className="text-gray-500">Loading available slots...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md shadow-md transition ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              }`}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;
