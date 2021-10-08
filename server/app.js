var express = require('express');

const FollowsRouter = require('./Routes/FollowsRoute');
const PostsRouter = require('./Routes/PostsRoute');
const CommentsRouter = require('./Routes/CommentsRoute');
const FlagsRouter = require('./Routes/FlagsRoute');
const FlagReasonsRouter = require('./Routes/FlagReasonsRoute');
const PollsRouter = require('./Routes/PollsRoute');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Follows
app.use('/api/userinteraction', FollowsRouter);

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