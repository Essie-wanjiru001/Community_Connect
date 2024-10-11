const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/user');

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.get('/logout', logoutUser);

module.exports = router;
