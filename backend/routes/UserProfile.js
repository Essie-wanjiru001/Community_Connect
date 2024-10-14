
const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile } = require('../controllers/userProfile');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createOrUpdateProfile);
router.get('/', authenticateToken, getProfile);

module.exports = router;