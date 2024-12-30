class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.profile_pictures = [];
    this.posts = [];
    this.comments = [];
  }
}

class ProfilePicture {
  constructor(id, user_id, image_data, is_active = false) {
    this.id = id;
    this.user_id = user_id;
    this.image_data = image_data;
    this.is_active = is_active;
  }
}

class Post {
  constructor(id, user_id, title, content, category_id) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.content = content;
    this.category_id = category_id;
    this.comments = [];
  }
}

class Comment {
  constructor(id, post_id, user_id, text) {
    this.id = id;
    this.post_id = post_id;
    this.user_id = user_id;
    this.text = text;
  }
}

class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.posts = [];
  }
}

module.exports = { User, ProfilePicture, Post, Comment, Category };
