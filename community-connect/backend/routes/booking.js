const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Imports the Booking model

// Create a booking
router.post('/booking', async (req, res) => {
  const { serviceProvider, date, userId } = req.body;
  try {
    const newBooking = new Booking({ serviceProvider, date, userId });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating booking' });
  }
});

module.exports = router;
