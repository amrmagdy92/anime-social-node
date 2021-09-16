var router = require('express').Router();
const PollsController = require('../Controllers/Polls/Polls');

router.post('/vote', PollsController.addVote());

module.exports = router;