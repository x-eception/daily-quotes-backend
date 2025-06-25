const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
  try {
    const tokens = await Token.find().select('token -_id');
    const messages = tokens.map(({ token }) => ({
      to: token,
      sound: 'default',
      title: '🌟 New Inspiration!',
      body: 'Here is your daily quote!',
      data: { source: 'DailyQuotesApp' },
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Expo API response:', result);

    res.json({ message: 'Notifications sent', result });
  } catch (err) {
    console.error('❌ Error sending notifications:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

module.exports = router;
