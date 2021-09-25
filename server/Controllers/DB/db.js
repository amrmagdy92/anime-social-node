require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    createUserSocialDetails: (userID) => {
        var query = `CALL anime_social_db.create_users_social_details(${userID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncUserFollowingsCount: (followerID) => {
        var query = `CALL anime_social_db.sync_user_followings_count(${followerID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncUserFollowersCount: (followingID) => {
        var query = `CALL anime_social_db.sync_user_followers_count(${followingID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncCommentRepliesCount: (commentParentID) => {
        var query = `CALL anime_social_db.sync_comments_replies_count(${commentParentID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncPostFlagsCount: (postID) => {
        var query = `CALL anime_social_db.sync_post_flags_count)${postID}`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncCommentFlagsCount: (commentID) => {
        var query = `CALL anime_social_db.sync_comment_flags_count(${commentID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncPostCommentsCount: (postID) => {
        var query = `CALL anime_social_db.sync_post_comments_count(${postID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncCommentReactionsCount: (commentID) => {
        var query = `CALL anime_social_db.sync_comment_reactions_count(${commentID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    syncPostReactionsCount: (postID) => {
        var query = `CALL anime_social_db.sync_post_reactions_count(${postID})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    createBlockedUser: (blockerUserID, blockedUserID, blockedAt) => {
        var query = `CALL anime_social_db.create_blocked_user(${blockerUserID}, ${blockedUserID}, ${blockedAt})`;
        connection.query(query, (err) => {
            if (err) throw err;
        });
    },
    checkIfThisPostIsMine: (userID, postID) => {}
}