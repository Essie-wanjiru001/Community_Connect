const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telephone: { type: String, required: true },
  location: { type: String, required: true },
  businessCategory: { type: String, required: true },
  openHours: { type: String, required: true },
  availability: { type: String, required: true },
  profilePhoto: { type: String },
  servicePhotos: [{ type: String }]
});

module.exports = mongoose.model('Business', businessProfileSchema);