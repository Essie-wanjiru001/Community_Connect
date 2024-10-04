const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Adds a review
router.post('/reviews/add', async (req, res) => {
  const { rating, review, serviceId, userId } = req.body;

  try {
    const newReview = new Review({ rating, review, serviceId, userId });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// View reviews for a service
router.get('/reviews/view', async (req, res) => {
  const { serviceId } = req.query;

  try {
    const reviews = await Review.find({ serviceId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
