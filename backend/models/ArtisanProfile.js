const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const artisanProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telephone: { type: String, required: true },
  location: { type: String, required: true },
  serviceType: { type: String, required: true },
  charges: { type: String, required: true },
  availability: [availabilitySlotSchema],
  profilePhoto: { type: String },
  servicePhotos: [{ type: String }],
  calendarSettings: {
    advanceBookings: { type: Number, default: 30 }, // Days in advance a booking can be made
  },
});

module.exports = mongoose.model('Artisan', artisanProfileSchema);