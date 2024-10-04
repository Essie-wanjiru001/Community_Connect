const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); // Imports the service model

// Search API endpoint
router.get('/search', async (req, res) => {
  const { serviceType, location, availability } = req.query;

  try {
    const query = {};

    if (serviceType) query.serviceType = { $regex: serviceType, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (availability) query.availability = { $regex: availability, $options: 'i' };

    const services = await Service.find(query);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

module.exports = router;
