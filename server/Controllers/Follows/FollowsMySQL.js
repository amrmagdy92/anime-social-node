require('dotenv').config();
var mysql = require('mysql');
var dbSync = require('../DB/db');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getUserById: (userID) => {
        var query = `SELECT user_id FROM anime_db.oauth_users WHERE user_id = ${userID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        });
    },
    getFollowed: (followerID, followingID) => {
        var query = `SELECT follow_id FROM anime_social_db.follows WHERE follower_id = ${followerID} AND following_id = ${followingID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        });
    },
    isBlockedUser: (blockerUserID, blockedUserID) => {
        var query = `SELECT id FROM anime_db.blocked_users WHERE (blocker_user_id = ${blockerUserID} AND blocked_user_id = ${blockedUserID}) OR (blocker_user_id = ${blockedUserID} AND blocked_user_id = ${blockerUserID}) LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        });
    },
    insertFollow: (followerID, followingID) => {
        var data = {
            "follower_id": followerID,
            "following_id": followingID,
        };
        var query = "INSERT INTO anime_social_db.follows SET ?";
        var comment_id;

        connection.query(query, data, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return comment_id = results.insertID;
        });
        dbSync.syncUserFollowingsCount(followerID);
        dbSync.syncUserFollwersCount(followingID);
    },
    deleteFollow: (followerID, followingID) => {
        var query = `DELETE FROM anime_social_db.follows WHERE follower_id = ${followerID} AND following_id = ${followingID}`;
        
        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        });
        dbSync.syncUserFollowingsCount(followerID);
        dbSync.syncUserFollwersCount(followingID);
    },
    createBlockedUser: (blockerUserID, blockedUserID) => {
        // TODO: Ask Lelouch how this is is built in FollowsStorage.php
        var blockedAt = new Date().toISOString().split('T')[0];
    },
    deleteBlockedUser: (blockerUserID, blockedUserID) => {
        var query = `DELETE FROM anime_db.blocked_users WHERE blocker_user_id = ${blockerUserID} AND blocked_user_id = ${blockedUserID}`;

        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        });
    },
    searchUsers: (params) => {
        // TODO: Check with Lelouch how this function works
    },
    getFollows: (params) => {
        var type = params._type;
        var pageNumber = params._page_number;
        var recordsPerPage = params._records_per_page;
        var start = params._start;
        var orderBy = params._order_by;

        var types = ['followings', 'followers', 'search-followings', 'block-followers'];
        if (!types.includes(type)){
            console.error(`This type is not allowed ${type}. It should be one of these: ${types}`);
        };

        if (!pageNumber && !(pageNumber > 0)) {
            pageNumber = 1;
        };

        var recordsPerPages = ['25', '50', '75', '100'];
        if(!recordsPerPages.includes(recordsPerPage)) {
            recordsPerPage = '100';
        };

        if (!start && start > 0) {
            start = 0;
        };

        var orderBys = {
            'followed_at_asc' : 'Followed At Asc',
            'followed_at_desc' : 'Followed At Desc',
            'user_created_at_asc' : 'User Created At Asc',
            'user_created_at_desc' : 'User Created At Desc',
            'user_full_name_asc' : 'User Full Name Asc',
            'user_full_name_desc' : 'User Full Name Desc',
            'blocked_at_asc' : 'Blocked At Asc',
            'blocked_at_desc' : 'Blocked At Desc'
        };
        
        if (!orderBys.hasOwnProperty(orderBy)) {
            orderBy = 'user_created_at_desc';
        };

        var COLS = '';
        var WHERE = '';
        var JOIN = '';
        var loggedUserID = params.logged_user_id.trim();

        if (type === 'followings') {
            var followerID = params.follower_id.trim();

            if (!followerID || (typeof followerID != String)) {
                console.error(`The follower_id field cannot be empty and must be a string`);
            }

            JOIN += ` INNER JOIN anime_social_db.follows ON oauth_users.user_id = follows.following_id AND follower_id = ${followerID}`;
        }

        if (type === 'followers') {
            var followingID = params.following_id.trim();

            if (!followingID || (typeof followingID != String)) {
                console.error(`The following_id field cannot be empty and should be a string`);
            }

            JOIN += ` INNER JOIN anime_social_db.follows ON oauth_users.user_id = follows.follower_id AND following_id = ${followingID}`;
        }

        if (type === 'search-followings') {
            var keyword = params.keyword.trim().toLowerCase();
            var followerID = params.loggedUserID.trim();

            JOIN += ` LEFT OUTER JOIN anime_socail_db.follows ON oauth_users.user_id = follows.folloing_id AND follower_id = ${followerID}`;
            WHERE += ` AND follow_id IS NULL AND oauth_users.user_id != ${followerID} AND users.username LIKE ${keyword}`;
        }

        if (type === 'block-followers') {
            var blocker_user_id = params.blocker_user_id.trim();

            JOIN += ` INNER JOIN anime_social_db.blocked_users ON oauth_users.user_id = blocker_users.blocker_user_id AND blocked_users.blocker_user_id = ${blocker_user_id}`;
        }

        if ((loggedUserID === '') && ['followings', 'followers'].includes(type)) {
            COLS += `, IF(your_followings.following_id IS NULL, \'No\',\'Yes\') is_you_following, IF(follows_you.follower_id IS NULL, \'No\',\'Yes\') is_follows_you`;
            JOIN += ` LEFT OUTER JOIN follows your_followings ON oauth_users.user_id = your_followings.following_id AND your_followings.follower_id = ${loggedUserID} LEFT OUTER JOIN follows follows_you ON oauth_users.user_id = follows_you.follower_id AND follows_you.following_id = ${loggedUserID}`;
        }

        var query = `SELECT oauth_users.user_id, users.username, users.user_full_name, users.user_image, IF(users_social_details.user_followings_count IS NULL, \'0\', users_social_details.user_followings_count) user_followings_count, IF(users_social_details.user_followers_count IS NULL, \'0\', users_social_details.user_followers_count) user_followers_count ${COLS} FROM anime_db.oauth_users INNER JOIN anime_db.users ON oauth_users.user_id = users.user_id ${JOIN} LEFT OUTER JOIN anime_social_db.users_social_details ON oauth_users.user_id = users_social_details.user_id WHERE 1 = 1 ${WHERE}`;
        
        if (orderBy === 'followed_at_asc') {
            query += ' ORDER BY follows.followed_at ASC';
        } else if (orderBy === 'followed_at_desc') {
            query += ' ORDER BY follows.followed_at DESC';
        } else if (orderBy === ' blocked_at_asc') {
            query += ' ORDER BY blocked_users.blocked_at ASC';
        } else if (orderBy === 'blocked_at_desc') {
            query += ' ORDER BY blocked_users.blocked_at DESC';
        } else if (orderBy === 'user_created_at_asc') {
            query += ' ORDER BY users.created_at ASC';
        } else if (orderBy === 'user_created_at_desc'){
            query += ' ORDER BY users.created_at DESC';
        } else if (orderBy === 'user_full_name_asc') {
            query += ' ORDER BY users.user_full_name ASC';
        } else if (orderBy === 'user_full_name_desc') {
            query += ' ORDER BY users,user_full_name DESC';
        }

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return {
                    meta: {
                        'page_number': pageNumber,
                        'records_per_page': recordsPerPage,
                        'order_by': orderBy,
                        'count': results.length
                    },
                    data: {results}
                };
            }
        });
    }
}