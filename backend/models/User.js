const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['business', 'artisan', 'consumer'], // Restrict userType to specific values
    default: 'consumer', // Optional default value
  },
  profile: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'userType' 
  }

});

// Hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
