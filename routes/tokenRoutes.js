const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

router.post('/save', async (req, res) => {
  const { token } = req.body;
  console.log('📥 Received token:', token);

  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const existing = await Token.findOne({ token });
    if (existing) {
      return res.status(200).json({ message: 'Token already exists' });
    }

    await Token.create({ token });
    res.status(201).json({ message: 'Token saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving token', details: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const tokens = await Token.find().select('token -_id');
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tokens' });
  }
});

module.exports = router;
