const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  serviceProvider: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
