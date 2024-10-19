const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  console.log('Auth middleware called');
  console.log('Headers:', req.headers);

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    console.log('No token in Authorization header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found for token');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};