// routes/newsletter.js
const express = require('express');
const Newsletter = require('../model/Newsletter');
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware to parse JSON
router.use(bodyParser.json());

// POST route for handling newsletter subscriptions
router.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;

  // Validate the email
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Check if the email is already in the database
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ error: 'This email is already subscribed.' });
    }

    // Save the email to the database
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    res.status(200).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ error: 'Failed to subscribe to the newsletter.' });
  }
});
// Get all subscribers
router.get('/api/newsletter/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subscribers' });
  }
});

// Delete a subscriber
router.delete('/api/newsletter/unsubscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const deletedSub = await Newsletter.findOneAndDelete({ email });
    if (!deletedSub) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.status(200).json({ message: "Subscriber removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subscriber" });
  }
});

module.exports = router;
