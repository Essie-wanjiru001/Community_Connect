const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // Regex for email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Additional profile details
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: 'default_profile_picture.jpg' 
  },
  // Other profile fields as needed
}, { timestamps: true });

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;