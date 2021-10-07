var router = require('express').Router();
const CommentsController = require('../Controllers/Comments/Comments');

router.get('/', (req, res) => {
    CommentsController.getComments();
});
router.post('/create', (req, res) => {
    CommentsController.createComment();
});
router.post('/reaction', (req, res) => {
    CommentsController.reaction();
});
router.post('/update/:comment_id', (req, res) => {
    CommentsController.updateComment();
});
router.delete('/delete/:comment_id', (req, res) => {
    CommentsController.deleteComment();
});

module.exports = router;