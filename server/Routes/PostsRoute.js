var router = require('express').Router();
const PostsController = require('./Controllers/Posts');

router.get('/', PostsController.getPosts());
router.post('/create', PostsController.createPost());
router.post('/hide', PostsController.hide());
router.post('/reaction', PostsController.reaction());
router.post('/update/:post_id', PostsController.updatePost());
router.delete('/update/:post_id', PostsController.deletePost());

module.exports = router;