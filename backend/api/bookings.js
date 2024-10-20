import express from 'express';

const app = express();

app.post('/api/bookings', async (req, res) => {
  const { date, artisanId } = req.body;
  try {
    const booking = { date, artisanId, status: 'pending' }; // Mock response
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Booking creation failed' });
  }
});

export default app;
