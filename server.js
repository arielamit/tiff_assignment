const express = require('express');
const app = express();
const { addUser, addPost, addComment, addCategory } = require('./routes');

app.use(express.json());

// Example route for adding a user
app.post('/addUser', (req, res) => {
  const { username, email } = req.body;
  const user = addUser(username, email);
  res.status(201).json(user);
});

// More routes for other actions (e.g., adding posts, comments, categories)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
