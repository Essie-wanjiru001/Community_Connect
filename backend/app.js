require('dotenv').config();
const express = require('express');
const http = require('http'); // HTTP server for Socket.IO
const { Server } = require('socket.io'); // Importing Socket.IO
const connectDB = require('./config/db'); // MongoDB connection
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// Importing Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app); // Creating the HTTP server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://community-connect-01uy.onrender.com', "https://community-connect-five.vercel.app/"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// **Connect to the Database**
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// **Session Middleware**
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

// **Initialize Passport.js**
app.use(passport.initialize());
app.use(passport.session());

// **Enable CORS for the Frontend**
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// **Body Parsers**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **Test Route**
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Community Connect API!');
});

// **Routes**
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bookings', bookingRoutes);

// **Socket.IO Event Handling**
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
    console.log(`Message sent to room ${roomId}:`, msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// **Start the Server with Socket.IO**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
