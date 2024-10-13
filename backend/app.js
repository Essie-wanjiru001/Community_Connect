require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const passport = require('passport');  // Keeping this for other uses if needed
const session = require('express-session');  // Keeping this for session-based purposes

const app = express();

// Connect to the database
connectDB().catch(err => console.error('Error connecting to MongoDB:', err));

// Enable CORS for React Frontend
const corsOptions = {
  origin: 'http://localhost:3000',  // Adjust based on your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management (if you're using Passport for other purposes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport.js (if needed for other routes)
app.use(passport.initialize());
app.use(passport.session());

// Basic route for testing the server
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Community Connect API!');
});

// Authentication routes for registration and login
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
