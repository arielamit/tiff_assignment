const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.send('Welcome to the main page of the app!');
});

// Example of posts route
router.get('/posts', (req, res) => {
  res.send('Here are the posts');
});

// Add more routes as needed
router.post('/addUser', (req, res) => {
  res.send('User added');
});

// Export the router
module.exports = router;
