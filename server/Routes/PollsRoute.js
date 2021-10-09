var router = require('express').Router();
const PollsController = require('../Controllers/Polls/Polls');

router.post('/vote', (req, res) => {
    res.json(PollsController.addVote(
        req.headers.authorization,
        req.body.post_id,
        req.body.poll_id,
        req.body.choice_id
    ));
});

router.post('/create', (req, res) => {
    res.json(PollsController.createPoll(
        req.headers.authorization,
        req.body.poll_length,
        req.body.post_id,
        req.body.choices_data
    ));
})

module.exports = router;