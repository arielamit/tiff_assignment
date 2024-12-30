const express = require('express');
const app = express();

// Route to handle the root URL "/"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Listen on the port provided by Heroku or default to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
