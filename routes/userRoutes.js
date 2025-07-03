const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, role, pollId } = req.body;
  try {
    let user;
    if (role === 'host') {
      user = await User.findOne({ name, role });
      if (!user) {
        user = new User({ name, role });
        await user.save();
      }
    } else if (role === 'attendee') {
      user = await User.findOne({ name, role, pollId });
      if (!user) {
        user = new User({ name, role, pollId });
        await user.save();
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(201).json(user); // Always return the user (existing or new)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
