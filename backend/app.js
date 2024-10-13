const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport'); 
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB().catch(err => console.error('Error connecting to MongoDB:', err));

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:3000',  // react frontend url
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Community Connect API!');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
