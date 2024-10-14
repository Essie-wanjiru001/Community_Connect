
const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['artisan', 'local business', 'customer'],
    required: true
  },
  serviceType: {
    type: String,
    required: function() {
      return this.userType === 'artisan' || this.userType === 'local business';
    }
  },
  location: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: function() {
      return this.userType === 'artisan' || this.userType === 'local business';
    }
  },
  pricing: {
    type: String,
    required: function() {
      return this.userType === 'artisan' || this.userType === 'local business';
    }
  }
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;