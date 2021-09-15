var router = require('express').Router();
const CommentsController = require('./Controllers/Comments');

router.get('/', CommentsController.getComments());
router.post('/create', CommentsController.createComment());
router.post('/reaction', CommentsController.reaction());
router.post('/update/:comment_id', CommentsController.updateComment());
router.delete('/delete/:comment_id', CommentsController.deleteComment());

module.exports = router;