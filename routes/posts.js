const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/postsControllers');
const { isAuth } = require('../service/auth');

/* GET users listing. */
router.get('/', PostsControllers.getPosts);
router.post('/', isAuth, PostsControllers.createPost);
router.patch('/:id', isAuth, PostsControllers.editPost);
router.delete('/:id', isAuth, PostsControllers.delPost);

module.exports = router;
