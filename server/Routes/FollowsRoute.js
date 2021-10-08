var router = require('express').Router();
var FollowController = require('../Controllers/Follows/Follows');

router.post('/follow', (req, res) => {
    FollowController.follow();
});
router.post('/unfollow', (req, res) => {
    FollowController.unfollow();
});
router.post('/block-user', (req,res) => {
    FollowController.blockUser();
});
router.post('/unblock-user', (req, res) => {
    FollowController.unblockUser()
});
router.get('/search-followings', (req, res) => {
    FollowController.getSearchFollowings();
});
router.get('/followings', (req, res) => {
    FollowController.getFollowings();
});
router.get('/followers', (req, res) => {
    FollowController.getFollowers();
});
router.get('/blocked-users', (req, res) => {
    FollowController.getBlockedUsers();
});

module.exports = router;