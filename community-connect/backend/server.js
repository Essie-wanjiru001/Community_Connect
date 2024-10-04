const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Import Socket.IO
const bookingRoute = require('./routes/booking');
const searchRoute = require('./routes/search');
const reviewRoute = require('./routes/review');

const Chat = require('./models/Chat'); // Imports the Chat model

const app = express();
app.use('/api', reviewRoute);
const server = http.createServer(app); // Creates HTTP server for Socket.IO
const io = new Server(server); // Initializes Socket.IO

// Middleware
app.use(express.json());

// Routes
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
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
