var router = require('express').Router();
const CommentsController = require('../Controllers/Comments/Comments');

router.get('/', (req, res) => {
    res.json(CommentsController.getComments(req.headers.authorization, req.params));
});
router.post('/create', (req, res) => {
    res.json(CommentsController.createComment(
        req.headers.authorization,
        req.body.comment_reference_id,
        req.body.comment_reference_type,
        req.body.comment_parent_id,
        req.body.comment_text,
        req.body.comment_is_spoiler,
        req.body.comment_reply_to_user_id
    ));
});
router.post('/reaction', (req, res) => {
    res.json(CommentsController.reaction(
        req.headers.authorization,
        req.body.comment_id,
        req.body.reaction
    ));
});
router.post('/update/:comment_id', (req, res) => {
    res.json(CommentsController.updateComment(
        req.headers.authorization,
        req.body.comment_id,
        req.body.comment_text,
        req.body.comment_is_spoiler
    ));
});
router.delete('/delete/:comment_id', (req, res) => {
    res.json(CommentsController.deleteComment(
        req.headers.authorization,
        req.body.comment_id
    ));
});

module.exports = router;