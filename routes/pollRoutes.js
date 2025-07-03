const express = require('express');
const Poll = require('../models/poll');
const router = express.Router();

router.post('/', async (req, res) => {
  const { question, options, createdBy } = req.body;
  try {
    const poll = new Poll({ question, options, createdBy });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

router.get('/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.json(poll);
});

router.post('/:id/vote', async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).send('Poll not found');

  poll.options[optionIndex].votes += 1;
  await poll.save();

  res.json(poll);
});

module.exports = router;
