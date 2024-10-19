require('dotenv').config();
const express = require('express');
const http = require('http'); // Needed for Socket.IO
const { Server } = require('socket.io'); // Importing Socket.IO
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const passport = require('passport');
const session = require('express-session');

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Connect to the database
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware for session management
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

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS for the frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing the server
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Community Connect API!');
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('join room', ({ userId, otherUserId }) => {
    const roomId = [userId, otherUserId].sort().join('-');
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('chat message', (msg) => {
    const roomId = [msg.sender, msg.receiver].sort().join('-');
    io.to(roomId).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
