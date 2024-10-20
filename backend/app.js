require('dotenv').config(); // Load environment variables
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db'); // MongoDB connection
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app); // HTTP server for Socket.IO
const io = new Server(server); // Initialize Socket.IO

// Allowed origins for CORS (split by comma if multiple are provided)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
];

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: allowedOrigins, credentials: true })); // CORS config
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true })); // URL-encoded parser

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send('Hello, welcome to the Community Connect API!')); // Test route
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/profile', profileRoutes); // Profile routes
app.use('/api/bookings', bookingRoutes); // Booking routes

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('join room', ({ userId, otherUserId }) => {
    const roomId = [userId, otherUserId].sort().join('-'); // Create unique room ID
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('chat message', (msg) => {
    const roomId = [msg.sender, msg.receiver].sort().join('-');
    io.to(roomId).emit('chat message', msg);
    console.log(`Message sent to room ${roomId}:`, msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
