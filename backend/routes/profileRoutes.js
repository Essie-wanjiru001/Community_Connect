const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route for fetching artisan profiles
router.get('/artisans', ProfileController.getArtisanProfiles);

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/', ProfileController.getProfile);
// Update user profile
router.put('/', ProfileController.updateProfile);

// Delete profile photo
router.delete('/photo', ProfileController.deleteProfilePhoto);

// Delete service photo
router.delete('/photos/:photoIndex', ProfileController.deleteServicePhoto);

module.exports = router;