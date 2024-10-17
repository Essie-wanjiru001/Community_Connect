const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route (protected)
router.post('/logout', authMiddleware, (req, res) => {
  // Implement logout logic here
  // This might involve invalidating the token on the server-side if you're using a token blacklist
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;