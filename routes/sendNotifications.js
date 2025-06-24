const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const Token = require('../models/Token');

const expo = new Expo();

router.post('/', async (req, res) => {
  try {
    const tokens = await Token.find().select('token -_id');

    const messages = tokens.map(({ token }) => {
      if (!Expo.isExpoPushToken(token)) return null;

      return {
        to: token,
        sound: 'default',
        title: '🌟 New Inspiration!',
        body: 'Here is your daily quote!',
      };
    }).filter(Boolean); // remove nulls

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        console.error('❌ Error sending chunk:', err);
      }
    }

    res.json({ message: 'Notifications sent', tickets });
  } catch (err) {
    console.error('❌ Error sending notifications:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

module.exports = router;
