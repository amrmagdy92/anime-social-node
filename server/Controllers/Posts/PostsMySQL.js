require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getAnimeByID: (animeID) => {
        var query = `SELECT anime_id, anime_android_published, anime_ios_published FROM anime_db.animes WHERE anime_id = ${animeID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0];
        });
    },
    getPostByID: (postID) => {
        var query = `SELECT post_id, authore_id FROM anime_social_db.posts WHERE post_id = ${postID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0];
        })
    },
    getPostsCountForToday: (authorID, postScope) => {
        var today = new Date().toISOString().split('T')[0];
        var query = `SELECT COUNT(post_id) posts_count_for_today FROM anime_social_db.posts WHERE author_id = ${authorID} AND post_scope = ${postScope} AND post_created_at = ${today} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0];
        });
    },
    getPosts: (params) => {
        var pageNumber = params._page_number;
        var recordsPerPage = params._records_per_page;
        var start = params._start;
        var orderBy = params._order_by;
        var userID = params.user_id;
        var postScope = params.post_scope;

        if (!pageNumber || !(pageNumber > 0)) {
            pageNumber = 1;
        }

        var recordsPerPages = ['25', '50', '75', '100'];
        if (!recordsPerPages.includes(recordsPerPage)) {
            recordsPerPage = 100;
        }

        if (!start || !(start > 0)) {
            start = 0;
        }

        var orderBys = {'post_created_at_desc': 'Created At Desc'};
        if (!orderBys.hasOwnProperty(orderBy)) {
            orderBy = 'post_created_at_desc';
        }

        var JOIN = '';
        var WHERE = '';

        if (postScope == 'Public') {
            WHERE = ` AND posts.post_scope = ${postScope}`;
        }

        if (postScope == 'Following') {
            JOIN = ` INNER JOIN follows ON posts.author_id = follows.following_id `;
            WHERE = ` AND posts.post_scope = ${postScope} AND (follows.follower_id = ${userID} OR posts.author_id = ${userID})`;
        }

        if (userID) {
            JOIN = ` LEFT OUTER JOIN posts_hidden ON (posts.post_id = posts_hidden.post_id AND posts_hidden.user_id = ${userID})`;
            WHERE = ` AND posts_hidden.post_id IS NULL`;
        }

        var query = `SELECT oauth_users.user_id, oauth_users.username, users.user_full_name, users.user_image, posts.post_id, posts.post_text, posts.post_scope, posts.ost_is_spoiler, posts.post_created_at, posts.post_likes_count, posts.post_dislikes_count, posts.post_comments_count, posts.post_flags_count FROM anime_social_db.posts INNER JOIN anime_db.oaith_users ON posts.author_id = oauth_users.user_id INNER JOIN anime_db.users ON oauth_users.user_id = users.user_id LEFT OUTER JOIN anime_social_db.posts_animes ON posts.post_id = posts_animes.post_id ${JOIN} WHERE 1 = 1 ${WHERE}`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];

        });
    },
    insertPost: (authorID, postText, postScope, postIsSpoiler, postYoutubeURL, postType) => {
        var regExp = /(^|[^a-z0-9_])#([a-z0-9_]+)/i;
        // TODO: Ask lelouch how preg_match_all works in php
    },
    insertPostAnime: (postID, animeID) => {
        var query = 'INSERT INTO anime_social_db.posts_animes SET ?';
        var data = {
            'post_id': postID,
            'anime_id': animeID
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'INSERT was successful';
        });
    },
    insertPostEmbeddedUrl: (postID, embeddedURLID) => {
        var query = 'INSERT INTO anime_social_db.posts_embedded_urls SET ?';
        var data = {
            'post_id': postID,
            'embedded_url_d': embeddedURLID
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'INSERT was successful';
        });
    },
    insertPostImage: (postID, imageID) => {
        var query = 'INSERT INTO anime_social_db.posts_images SET ?';
        var data = {
            'post_id': postID,
            'image_id': imageID
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'INSERT was successful';
        });
    },
    insertPostVideo: (postID, videoID) => {
        var query = 'INSERT INTO anime_social_db.posts_videos SET ?';
        var data = {
            'post_id': postID,
            'video_id': videoID
        };
        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'INSERT was successful';
        });
    },
    updatePost: (postID, postText, postIsSpoiler) => {
        var query = `UPDATE anime_social_db.posts SET post_text = ${postText}, post_is_spoiler = ${postIsSpoiler} WHERE post_id = ${postID}`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'UPDATE was successful';
        });
    },
    deletePost: (postID) => {
        var query = `DELETE FROM anime_social_db.posts WHERE post_id = ${postID}`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'DELETE was successful';
        });
    },
    hidePost: (postID, userID) => {
        var query = `DELETE FROM anime_social_db.posts_hidden WHERE post_id = ${postID} AND user_id = ${userID}`;
        var data = {
            'post_id': postID,
            'user_id': userID,
            'post_hidden_at': new Date().toISOString().split('T')[0]
        };
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'DELETE was successful';
        });
        query = `INSERT INTO anime_social_db.posts_hidden SET ?`;
        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'INSERT was successful';
        });
    },
    savePostReaction: (userID, postID, reaction) => {
        var query = `DELETE FROM anime_social_db.posts_reactions WHERE post_id = ${postID} AND user_id = ${userID}`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'DELETE was successful';
        });
        var reactionValues = ['rlike', 'rdislike'];
        if (!reactionValues.includes(reaction)){
            query = 'INSERT INTO anime_social_db.posts_reactions SET ?'
            var data = {
                'post_id': postID,
                'user_id': userID,
                'reaction': reaction,
                'reaction_at': new Date().toISOString().split('T')[0]
            };
            connection.query(query, data, (err, results, fields) => {
                if (err) console.error(`Encountered the following error: ${err}`);
                if (results.length == 0) return [];
                return 'INSERT was successful';
            });
        };

        // TODO: Define syncPostReactionsCount()
        syncPostReactionsCount(postID);
    },
    insertPoll: (postID, pollLength, authorID) => {
        var query = 'INSERT INTO anime_social_db.posts_polls SET ?';
        var data = {
            'post_id': postID,
            'poll_length': pollLength,
            'author_id': authorID,
            'created_at': new Date().toISOString().split('T')[0]
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0].insertID;
        });
    },
    insertChoice: (pollID, choiceTitle, animeID, charactersID) => {
        var query = 'INSERT INTO anime_social_db.posts_polls_choices SET ?';
        var data = {
            'poll_id': pollID,
            'choice_title': choiceTitle,
            'anime_id': animeID,
            'characters_id': charactersID
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0].insertID;
        });
    }
}