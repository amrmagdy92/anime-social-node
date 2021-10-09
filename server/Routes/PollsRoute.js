var router = require('express').Router();
const PollsController = require('../Controllers/Polls/Polls');

router.post('/vote', (req, res) => {
    PollsController.addVote();
});

router.post('/create', (req, res) => {
    res.json(PollsController.createPoll());
})

module.exports = router;