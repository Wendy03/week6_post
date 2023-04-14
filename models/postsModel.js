const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '貼文ID未填寫'],
    },
  },
  { versionKey: false }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
