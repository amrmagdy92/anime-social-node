var express = require('express');

const PostsRouter = require('./Routes/PostsRoute');
const CommentsRouter = require('./Routes/CommentsRoute');
const FlagsRouter = require('./Routes/FlagsRoute');
const FlagReasonsRouter = require('./Routes/FlagReasonsRoute');
const PollsRouter = require('./Routes/PollsRoute');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Follows
app.post('/api/follow', (req, res) => {
    res.json(FollowController.follow(
        req.headers.authorization,
        req.body.following_id
    ));
});

app.post('/api/unfollow', (req, res) => {
    res.json(FollowController.unfollow(
        req.headers.authorization,
        req.body.following_id
    ));
});

app.post('/api/block-user', (req, res) => {
    res.json(FollowController.blockUser(
        req.headers.authorization,
        req.body.blocked_user_id
    ));
});

app.post('/api/unblock-user', (req, res) => {
    res.json(FollowController.unblockUser(
        req.headers.authorization,
        req.body.blocked_user_id
    ));
});

app.get('/search-followings', (req, res) => {
    res.json(FollowController.getSearchFollowings(
        req.headers.authorization,
        req.params
    ));
});

app.get('/api/followings', (req, res) => {
    res.json(FollowController.getFollowings(
        req.headers.authorization,
        req.params
    ));
});

app.get('/api/followers', (req, res) => {
    res.json(FollowController.getFollowers(
        req.headers.authorization,
        req.params
    ));
});

app.get('/api/blocked-users', (req, res) => {
    res.json(FollowController.getBlockedUsers(
        req.headers.authorization,
        req.params
    ));
});

// Posts
app.use('/api/posts', PostsRouter);

// Comments
app.use('/api/comments', CommentsRouter);

// Flags
app.use('/api/flags', FlagsRouter);

// Flag Reasons
app.use('/api/flag-reasons', FlagReasonsRouter);

//Polls
app.use('/api/polls', PollsRouter);

module.exports = app;