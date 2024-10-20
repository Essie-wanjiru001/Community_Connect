import express from 'express';
import connectDB from '../config/db'; // Import database connection

const app = express();
connectDB(); // Ensure database connection is established

// Middleware to parse JSON requests
app.use(express.json());

// **GET User Profile**
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await UserProfile.findOne({ 'user._id': userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// **PUT Update User Profile**
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { 'user._id': userId },
      req.body,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Export the app to use as a serverless function
export default app;
