var router = require('express').Router();
var FollowController = require('../Controllers/Follows/Follows');

router.post('/follow', (req, res) => {
    res.json(FollowController.follow(
        req.headers.authorization,
        req.body.following_id
    ));
});
router.post('/unfollow', (req, res) => {
    res.json(FollowController.unfollow(
        req.headers.authorization,
        req.body.following_id
    ));
});
router.post('/block-user', (req,res) => {
    res.json(FollowController.blockUser(
        req.headers.authorization,
        req.body.blocked_user_id
    ));
});
router.post('/unblock-user', (req, res) => {
    res.json(FollowController.unblockUser(
        req.headers.authorization,
        req.body.blocked_user_id
    ));
});
router.get('/search-followings', (req, res) => {
    res.json(FollowController.getSearchFollowings(
        req.headers.authorization,
        req.params
    ));
});
router.get('/followings', (req, res) => {
    res.json(FollowController.getFollowings(
        req.headers.authorization,
        req.params
    ));
});
router.get('/followers', (req, res) => {
    res.json(FollowController.getFollowers(
        req.headers.authorization,
        req.params
    ));
});
router.get('/blocked-users', (req, res) => {
    res.json(FollowController.getBlockedUsers(
        req.headers.authorization,
        req.params
    ));
});

module.exports = router;