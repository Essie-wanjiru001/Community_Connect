const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  serviceType: String,
  location: String,
  availability: String,
  pricing: String,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
