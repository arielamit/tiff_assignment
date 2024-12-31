const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "database"
let users = [];
let posts = [];
let comments = [];
let profilePictures = [];

// Simulate auto-increment user, post, comment, and picture IDs
let userId = 1;
let postId = 1;
let commentId = 1;
let pictureId = 1;

// Route for the homepage with the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle adding users
app.post('/addUser', (req, res) => {
  const { username, email } = req.body;

  // Create a new user object with a unique ID
  const newUser = {
    id: userId++,
    username,
    email
  };

  // Save the user to the "database"
  users.push(newUser);

  // Redirect to a page where the user can see their posts, comments, etc.
  res.redirect(`/user/${newUser.id}`);
});

// Route to show user's posts, comments, and profile pictures
app.get('/user/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));

  if (!user) return res.status(404).send('User not found');

  // Filter posts, comments, and profile pictures related to the user
  const userPosts = posts.filter(post => post.userId === user.id);
  const userComments = comments.filter(comment => comment.userId === user.id);
  const userProfilePics = profilePictures.filter(picture => picture.userId === user.id);

  res.send(`
    <h1>${user.username}'s Dashboard</h1>
    <h2>Posts</h2>
    ${userPosts.map(post => `
      <div>
        <p><strong>${post.title}</strong>: ${post.content}</p>
        <p><em>Post ID: ${post.id}</em></p> <!-- Display Post ID here -->
        <button onclick="location.href='/deletePost/${post.id}?userId=${user.id}'">Delete Post</button>
      </div>
    `).join('')}
    
    <h2>Comments</h2>
    ${userComments.map(comment => `
      <div>
        <p>${comment.text}</p>
        <button onclick="location.href='/deleteComment/${comment.id}?userId=${user.id}'">Delete Comment</button>
      </div>
    `).join('')}
    
    <h2>Profile Pictures</h2>
    ${userProfilePics.map(picture => `
      <div>
        <img src="${picture.imageData}" alt="Profile Picture" width="100" />
        <button onclick="location.href='/deleteProfilePicture/${picture.id}?userId=${user.id}'">Delete Profile Picture</button>
      </div>
    `).join('')}
    
    <form action="/addPost/${user.id}" method="POST">
      <h3>Create Post</h3>
      <input type="text" name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required></textarea>
      <button type="submit">Submit Post</button>
    </form>
    
    <form action="/addComment/${user.id}" method="POST">
      <h3>Create Comment</h3>
      <input type="text" name="text" placeholder="Comment Text" required />
      <input type="number" name="postId" placeholder="Post ID" required />
      <button type="submit">Submit Comment</button>
    </form>
    
    <form action="/uploadProfilePicture/${user.id}" method="POST" enctype="multipart/form-data">
      <h3>Upload Profile Picture</h3>
      <input type="file" name="profilePicture" required />
      <button type="submit">Upload Picture</button>
    </form>
    
    <br />
    <a href="/">Go Back</a>
  `);
});

// Route to create a post
app.post('/addPost/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { title, content } = req.body;

  const newPost = {
    id: postId++,
    userId,
    title,
    content
  };

  posts.push(newPost);
  res.redirect(`/user/${userId}`);
});

// Route to create a comment (linked to a post)
app.post('/addComment/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const { text, postId } = req.body;
  
    // Check if the postId exists in the posts array
    const postExists = posts.some(post => post.id === parseInt(postId));
  
    if (!postExists) {
      // If the post does not exist, redirect back with an error message
      return res.status(400).send(`
        <h1>Error</h1>
        <p>The post with ID ${postId} does not exist. Please provide a valid Post ID.</p>
        <a href="/user/${userId}">Go Back</a>
      `);
    }
  
    const newComment = {
      id: commentId++,
      userId,
      text,
      postId: parseInt(postId) // Link the comment to the post by its ID
    };
  
    comments.push(newComment);
    res.redirect(`/user/${userId}`);
  });

// Route to upload a profile picture
app.post('/uploadProfilePicture/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);

  // In a real application, you would process the file and store it
  // For simplicity, we will simulate it with a placeholder image URL
  const newProfilePicture = {
    id: pictureId++,
    userId,
    imageData: "https://via.placeholder.com/150" // Simulated image data
  };

  profilePictures.push(newProfilePicture);
  res.redirect(`/user/${userId}`);
});

// Route to delete a post
app.get('/deletePost/:postId', (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = parseInt(req.query.userId); // Get the userId from query params

  // Delete the post by filtering out the post with the matching id
  posts = posts.filter(post => post.id !== postId);

// Also delete comments linked to this post by filtering out comments with the matching postId
comments = comments.filter(comment => comment.postId !== postId);

  // Redirect back to the user's dashboard
  res.redirect(`/user/${userId}`);
});

// Route to delete a comment
app.get('/deleteComment/:commentId', (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const userId = parseInt(req.query.userId); // Get the userId from query params

  // Delete the comment by filtering out the comment with the matching id
  comments = comments.filter(comment => comment.id !== commentId);

  // Redirect back to the user's dashboard
  res.redirect(`/user/${userId}`);
});

// Route to delete a profile picture
app.get('/deleteProfilePicture/:pictureId', (req, res) => {
  const pictureId = parseInt(req.params.pictureId);
  const userId = parseInt(req.query.userId); // Get the userId from query params

  // Delete the profile picture by filtering out the picture with the matching id
  profilePictures = profilePictures.filter(picture => picture.id !== pictureId);

  // Redirect back to the user's dashboard
  res.redirect(`/user/${userId}`);
});

// Set the port for the app
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
