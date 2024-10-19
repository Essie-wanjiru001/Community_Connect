import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { RootState, AppDispatch } from '../redux/store';
import { fetchArtisanProfile, fetchAvailableSlots, createBooking } from '../redux/slices/bookingSlice';

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

const BookingForm: React.FC = () => {
  const { artisanId } = useParams<{ artisanId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { artisanProfile, availableSlots, loading, error } = useSelector((state: RootState) => state.booking);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (artisanId) {
      console.log('Fetching artisan profile for ID:', artisanId);
      dispatch(fetchArtisanProfile(artisanId));
    }
  }, [dispatch, artisanId]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date && artisanId) {
      console.log('Fetching available slots for date:', date.toISOString().split('T')[0]);
      dispatch(fetchAvailableSlots({ artisanId, date: date.toISOString().split('T')[0] }));
    }
  };

  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    slot: Yup.string().required('Time slot is required'),
  });

  const handleSubmit = async (values: { date: Date | null; slot: string }) => {
    if (artisanId && values.date && values.slot && artisanProfile) {
      console.log('Creating booking:', { artisanId, date: values.date, slot: values.slot });
      const result = await dispatch(createBooking({ 
        artisanId, 
        date: values.date.toISOString().split('T')[0], 
        slot: values.slot,
        service: artisanProfile.serviceType || ''
      }));
      if (createBooking.fulfilled.match(result)) {
        console.log('Booking created successfully');
        navigate('/booking/list');
      } else {
        console.error('Failed to create booking:', result.error);
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!artisanProfile) return <div className="text-center mt-8">No artisan profile found. Please try again later.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book a Service with {artisanProfile.user.name}</h2>
      <p>Service: {artisanProfile.serviceType}</p>
      <p>Location: {artisanProfile.location}</p>
      <p>Contact: {artisanProfile.telephone}</p>
      <p>Email: {artisanProfile.email}</p>

      <Formik
        initialValues={{ date: null as Date | null, slot: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="mt-6">
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  handleDateChange(date);
                  setFieldValue('date', date);
                }}
                minDate={new Date()}
                maxDate={new Date(Date.now() + (artisanProfile.calendarSettings?.advanceBookings || 30) * 24 * 60 * 60 * 1000)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name="date" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="mb-4">
              <label htmlFor="slot" className="block text-sm font-medium text-gray-700">Select Time Slot</label>
              <Field as="select" name="slot" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select a time slot</option>
                {availableSlots.map((slot: AvailableSlot, index: number) => (
                  <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="slot" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Book Service
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;