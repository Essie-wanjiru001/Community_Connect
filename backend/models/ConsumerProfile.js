const mongoose = require('mongoose');

const consumerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telephone: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  profilePhoto: { type: String }
});

module.exports = mongoose.model('Consumer', consumerProfileSchema);