var router = require('express').Router();
const PostsController = require('../Controllers/Posts/Posts');

router.get('/', (req, res) => {
    res.json(PostsController.getPosts(
        req.headers.authorization,
        req.params
    ));
});
router.post('/create', (req, res) => {
    res.json(PostsController.createPost(
        req.headers.authorization,
        req.body.post_text,
        req.body.post_scope,
        req.body.post_is_spoiler,
        req.body.anime_id,
        req.body.post_youtube_url,
        req.body.image_ids,
        req.body.poll_length,
        req.body.choices_data,
        req.body.post_type,
        req.body.image_files
    ));
});
router.post('/hide', (req, res) => {
    res.json(PostsController.hide(
        req.headers.authorization,
        req.body.post_id
    ));
});
router.post('/reaction', (req, res) => {
    res.json(PostsController.reaction(
        req.headers.authorization,
        req.body.post_id,
        req.body.reaction
    ));
});
router.post('/update/:post_id', (req, res) => {
    res.json(PostsController.updatePost(
        req.headers.authorization,
        req.params.post_id,
        req.body.post_text,
        req.body.post_is_spoiler
    ));
});
router.delete('/update/:post_id', (req, res) => {
    res.json(PostsController.deletePost(
        req.headers.authorization,
        req.body.post_id
    ));
});

module.exports = router;