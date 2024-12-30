const { User, ProfilePicture, Post, Comment, Category } = require('./entities');

let users = [];
let posts = [];
let comments = [];
let categories = [];
let profilePictures = [];

function addUser(username, email) {
  const userId = users.length + 1;
  const user = new User(userId, username, email);
  users.push(user);
  return user;
}

function addPost(user_id, title, content, category_id) {
  const postId = posts.length + 1;
  const post = new Post(postId, user_id, title, content, category_id);
  posts.push(post);

  const user = users.find(u => u.id === user_id);
  user.posts.push(post);

  const category = categories.find(c => c.id === category_id);
  category.posts.push(post);

  return post;
}

function addComment(user_id, post_id, text) {
  const commentId = comments.length + 1;
  const comment = new Comment(commentId, post_id, user_id, text);
  comments.push(comment);

  const post = posts.find(p => p.id === post_id);
  post.comments.push(comment);

  const user = users.find(u => u.id === user_id);
  user.comments.push(comment);

  return comment;
}

function addCategory(name) {
  const categoryId = categories.length + 1;
  const category = new Category(categoryId, name);
  categories.push(category);
  return category;
}

module.exports = { addUser, addPost, addComment, addCategory };
