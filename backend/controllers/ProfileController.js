const User = require('../models/User');
const ConsumerProfile = require('../models/ConsumerProfile');
const ArtisanProfile = require('../models/ArtisanProfile');
const BusinessProfile = require('../models/BusinessProfile');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('getProfile called for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);

    let ProfileModel;
    switch (user.userType) {
      case 'consumer':
        ProfileModel = ConsumerProfile;
        break;
      case 'artisan':
        ProfileModel = ArtisanProfile;
        break;
      case 'business':
        ProfileModel = BusinessProfile;
        break;
      default:
        console.log('Invalid user type:', user.userType);
        return res.status(400).json({ message: 'Invalid user type' });
    }

    let profile = await ProfileModel.findOne({ user: user._id });
    console.log('Profile found:', profile);

    if (!profile) {
      console.log('Profile not found for user:', req.user.id);
      return res.status(404).json({ message: 'No Profile Details Found' });
    }

    res.json({ user: user.toObject({ getters: true }), profile });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

// Update user profile
exports.updateProfile = [
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'servicePhotos', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let ProfileModel;
      switch (user.userType) {
        case 'consumer':
          ProfileModel = ConsumerProfile;
          break;
        case 'artisan':
          ProfileModel = ArtisanProfile;
          break;
        case 'business':
          ProfileModel = BusinessProfile;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }

      const profileData = { ...req.body };

      // Handle availability separately for artisans
      if (user.userType === 'artisan' && profileData.availability) {
        profileData.availability = JSON.parse(profileData.availability);
      }

      // Handle calendar settings for artisans
      if (user.userType === 'artisan' && profileData.calendarSettings) {
        profileData.calendarSettings = JSON.parse(profileData.calendarSettings);
      }

      if (req.files && req.files.profilePhoto) {
        profileData.profilePhoto = req.files.profilePhoto[0].path;
      }

      if (req.files && req.files.servicePhotos) {
        profileData.servicePhotos = req.files.servicePhotos.map(file => file.path);
      }

      let profile = await ProfileModel.findOneAndUpdate(
        { user: user._id },
        { $set: profileData },
        { new: true, upsert: true, runValidators: true }
      );

      if (profileData.name) user.name = profileData.name;
      if (profileData.email) user.email = profileData.email;
      await user.save();

      res.json({ message: 'Profile updated successfully', user: user.toObject({ getters: true }), profile });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ message: 'Server error', error: error.toString() });
    }
  }
];

// Delete profile photo
exports.deleteProfilePhoto = async (req, res) => {
  try {
    console.log('deleteProfilePhoto called for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    let ProfileModel;
    switch (user.userType) {
      case 'consumer':
        ProfileModel = ConsumerProfile;
        break;
      case 'artisan':
        ProfileModel = ArtisanProfile;
        break;
      case 'business':
        ProfileModel = BusinessProfile;
        break;
      default:
        console.log('Invalid user type:', user.userType);
        return res.status(400).json({ message: 'Invalid user type' });
    }

    const profile = await ProfileModel.findOne({ user: user._id });
    if (!profile || !profile.profilePhoto) {
      console.log('No profile photo to delete');
      return res.status(400).json({ message: 'No profile photo to delete' });
    }

    fs.unlink(profile.profilePhoto, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });

    profile.profilePhoto = undefined;
    await profile.save();

    console.log('Profile photo deleted successfully');
    res.json({ message: 'Profile photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    res.status(500).json({ message: 'Server error', error: error.toString(), stack: error.stack });
  }
};

// Delete service photo
exports.deleteServicePhoto = async (req, res) => {
  try {
    console.log('deleteServicePhoto called for user:', req.user.id);
    console.log('Photo index:', req.params.photoIndex);

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    let ProfileModel;
    switch (user.userType) {
      case 'artisan':
        ProfileModel = ArtisanProfile;
        break;
      case 'business':
        ProfileModel = BusinessProfile;
        break;
      default:
        console.log('Invalid user type for service photos:', user.userType);
        return res.status(400).json({ message: 'Invalid user type for service photos' });
    }

    const profile = await ProfileModel.findOne({ user: user._id });
    const photoIndex = parseInt(req.params.photoIndex);

    if (!profile || !profile.servicePhotos || !profile.servicePhotos[photoIndex]) {
      console.log('No photo to delete at this index');
      return res.status(400).json({ message: 'No photo to delete at this index' });
    }

    const photoPath = profile.servicePhotos[photoIndex];

    fs.unlink(photoPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });

    profile.servicePhotos.splice(photoIndex, 1);
    await profile.save();

    console.log('Service photo deleted successfully');
    res.json({ message: 'Service photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting service photo:', error);
    res.status(500).json({ message: 'Server error', error: error.toString(), stack: error.stack });
  }
};



// New function to get available time slots
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { artisanId, date } = req.query;
    const artisan = await ArtisanProfile.findOne({ user: artisanId });
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const requestedDate = new Date(date);
    const availableSlots = artisan.availability.filter(slot => 
      slot.date.toDateString() === requestedDate.toDateString()
    );


    // Apply calendar settings
    const { advanceBookings } = artisan.calendarSettings;

    const now = new Date();
    const maxBookingDate = new Date(now.getTime() + advanceBookings * 24 * 60 * 60 * 1000);

    if (requestedDate > maxBookingDate) {
      return res.status(400).json({ message: 'Requested date is outside of allowed booking range' });
    }

    // Here you would also check against existing bookings
    // This is a simplified version and doesn't account for existing bookings

    res.json(availableSlots);
  } catch (error) {
    console.error('Error getting available time slots:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};


exports.getArtisanProfiles = async (req, res) => {
  try {
    const artisanProfiles = await ArtisanProfile.find()
      .populate('user', 'name')
      .select('serviceType charges profilePhoto servicePhotos user');
    res.json(artisanProfiles);
  } catch (error) {
    console.error('Error fetching artisan profiles:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};


module.exports = {
  getArtisanProfiles: exports.getArtisanProfiles,
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  deleteProfilePhoto: exports.deleteProfilePhoto,
  deleteServicePhoto: exports.deleteServicePhoto,
  getAvailableTimeSlots: exports.getAvailableTimeSlots
};