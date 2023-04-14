const successHandler = require('../service/successHandler');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const Post = require('../models/postsModel');

const posts = {
  getPosts: handleErrorAsync(async (req, res) => {
    const { keyword, sortby } = req.query;
    const search =
      keyword !== undefined ? { content: new RegExp(`${keyword}`) } : {};
    const sort = sortby === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await Post.find(search)
      .populate({
        path: 'user',
        select: 'name photo ',
      })
      .sort(sort);
    successHandler(res, '取得貼文', posts);
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    const { content, image, createdAt } = req.body;
    if (content === undefined) {
      return appError(400, 'content 必填', next);
    }
    const newPost = await Post.create({
      user: req.user.id,
      content,
      image,
      createdAt,
    });
    successHandler(res, '貼文新增成功', newPost);
  }),
  editPost: handleErrorAsync(async (req, res, next) => {
    const { content, image, likes } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    const currentPost = await Post.findById(postId).populate({
      path: 'user',
      select: 'name photo ',
    });
    if (!currentPost) {
      return appError(400, '查無此貼文', next);
    }
    if (currentPost.user.id !== userId) {
      return appError(400, '無權限編輯', next);
    }
    if (content === undefined) {
      return appError(400, 'content 必填', next);
    }
    const posts = await Post.findByIdAndUpdate(postId, {
      $set: {
        content,
        image,
        likes,
      },
    });
    successHandler(res, '貼文編輯成功', posts);
  }),
  delPost: handleErrorAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const currentPost = await Post.findById(postId).populate({
      path: 'user',
      select: 'name photo ',
    });
    if (currentPost.user.id !== userId) {
      return appError(400, '無權限編輯', next);
    }
    const posts = await Post.findByIdAndDelete(postId);
    successHandler(res, '貼文刪除', posts);
  }),
};

module.exports = posts;
