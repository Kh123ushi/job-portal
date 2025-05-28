import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/test-user', async (req, res) => {
  try {
    const { _id, name, email, resume, image } = req.body;

    // Basic validation
    if (!_id || !name || !email || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists (email is unique)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const user = new User({ _id, name, email, resume: resume || '', image });
    await user.save();

    res.status(201).json({ message: 'User inserted successfully', user });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Error inserting user', error: error.message });
  }
});

export default router;
