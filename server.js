const path = require('path');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database
const database = {
  users: [],
  profilePictures: [],
  posts: [],
  comments: [],
  categories: [],
};

// Middleware for JSON parsing
app.use(express.json());

// Unique ID generator
let currentId = 1;
const generateId = () => currentId++;

// Routes
app.get('/api/:entity', (req, res) => {
  const { entity } = req.params;
  if (!database[entity]) return res.status(404).send('Entity not found');
  res.json(database[entity]);
});

app.post('/api/:entity', (req, res) => {
  const { entity } = req.params;
  if (!database[entity]) return res.status(404).send('Entity not found');
  const id = generateId();
  const newEntity = { id, ...req.body };
  database[entity].push(newEntity);
  res.status(201).json(newEntity);
});

app.delete('/api/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  if (!database[entity]) return res.status(404).send('Entity not found');
  database[entity] = database[entity].filter(item => item.id !== parseInt(id, 10));
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
