
const UserProfile = require('../models/userProfile');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    let profile = await UserProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.userType = req.body.userType;
      profile.location = req.body.location;

      if (req.body.userType === 'artisan' || req.body.userType === 'local business') {
        profile.serviceType = req.body.serviceType;
        profile.availability = req.body.availability;
        profile.pricing = req.body.pricing;
      } else {
        // Remove these fields if the user type is changed to 'customer'
        profile.serviceType = undefined;
        profile.availability = undefined;
        profile.pricing = undefined;
      }

      await profile.save();
    } else {
      // Create new profile
      profile = new UserProfile({
        userId,
        ...req.body,
        ...(req.body.userType === 'artisan' || req.body.userType === 'local business'
          ? { serviceType: req.body.serviceType, availability: req.body.availability, pricing: req.body.pricing }
          : {})
      });

      await profile.save();
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};