const mongoose = require('mongoose');

const artisanProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telephone: { type: String, required: true },
  location: { type: String, required: true },
  serviceType: { type: String, required: true },
  charges: { type: String, required: true },
  availability: { type: String, required: true },
  profilePhoto: { type: String },
  servicePhotos: [{ type: String }]
});

module.exports = mongoose.model('Artisan', artisanProfileSchema);
