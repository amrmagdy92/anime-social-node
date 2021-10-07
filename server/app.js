var express = require('express');
const FollowController = require('./Controllers/Follows/Follows');

const PostsRouter = require('./Routes/PostsRoute');
const CommentsRouter = require('./Routes/CommentsRoute');
const FlagsRouter = require('./Routes/FlagsRoute');
const FlagReasonsRouter = require('./Routes/FlagReasonsRoute');
const PollsRouter = require('./Routes/PollsRoute');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// FIXME: Need to find a better route structure for the Follows logic
// Follows
app.post('/api/follow', (req, res) => {
    FollowController.follow();
});
app.post('/api/unfollow', (req, res) => {
    FollowController.unfollow();
});
app.post('/api/block-user', (req,res) => {
    FollowController.blockUser();
});
app.post('/api/unblock-user', (req, res) => {
    FollowController.unblockUser()
});
app.get('/api/search-followings', (req, res) => {
    FollowController.getSearchFollowings();
});
app.get('/api/followings', (req, res) => {
    FollowController.getFollowings();
});
app.get('/api/followers', (req, res) => {
    FollowController.getFollowers();
});
app.get('/api/blocked-users', (req, res) => {
    FollowController.getBlockedUsers();
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