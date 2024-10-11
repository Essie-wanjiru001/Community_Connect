const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const passport = require('passport');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user with hashed password
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token, embedding the user's id and email in the payload
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // JWT secret from environment variables
      { expiresIn: '1h' } // Token expiration (1 hour)
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Login successful',
      token, // Send the token back to the client
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error });
  }
};

// Logout a user
exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
};
