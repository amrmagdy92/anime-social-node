var router = require('express').Router();
const PostsController = require('../Controllers/Posts/Posts');

router.get('/', (req, res) => {
    PostsController.getPosts();
});
router.post('/create', (req, res) => {
    PostsController.createPost();
});
router.post('/hide', (req, res) => {
    PostsController.hide();
});
router.post('/reaction', (req, res) => {
    PostsController.reaction();
});
router.post('/update/:post_id', (req, res) => {
    PostsController.updatePost();
});
router.delete('/update/:post_id', (req, res) => {
    PostsController.deletePost();
});

module.exports = router;