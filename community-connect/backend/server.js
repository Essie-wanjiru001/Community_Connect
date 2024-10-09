const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Import Socket.IO
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection
const cors = require('cors'); // To handle CORS
require('dotenv').config(); // To load environment variables

const bookingRoute = require('./routes/booking');
const searchRoute = require('./routes/search');
const reviewRoute = require('./routes/review');

const Chat = require('./models/Chat'); // Import the Chat model

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server); // Initialize Socket.IO

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection using Mongoose
const uri = process.env.MONGO_URI || 'mongodb+srv://burongudaniel:cAYTadJ0pQw3VPqH@testing1.qygrq.mongodb.net/?retryWrites=true&w=majority&appName=Testing1'; // MongoDB connection string directly in the code

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

// Routes
app.use('/api', reviewRoute);
app.use('/api', bookingRoute);
app.use('/api', searchRoute);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle incoming chat messages
  socket.on('chat message', async (msgData) => {
    const { message, sender, receiver } = msgData;
    try {
      // Save the message to MongoDB
      const newMessage = new Chat({ message, sender, receiver });
      await newMessage.save();

      // Emit the saved message to all connected clients
      io.emit('chat message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start server with Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
