require('dotenv').config();
var mysql = require('mysql');
const dbSync = require('../DB/db'); // TODO: figure out a better name
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getReferenceObject: (commentReferenceID, commentReferenceType) => {
        if(commentReferenceID && commentReferenceType) {
            var query = `SELECT post_id comment_reference_id FROM anime_social_db.posts WHERE post_id = ${commentReferenceID} LIMIT 1`;
            connection.query(query, (err, results, field) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    return results[0];
                }
            });
        }
    },
    getCommentByID: (commentID) => {
        var query = `SELECT comments.comment_id, comments.author_id, comments.comment_parent_id, comment_reference_type FROM anime_social_db.comments WHERE comments.comment_id = ${commentID} LIMIT 1`
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return results[0];
            }
        });
    },
    getComments: (params) => {
        const pageNumber = params._page_number;
        const recordsPerPage = params._records_per_page;
        const start = params._start;
        const orderBy = params._order_by;
        const commentReferenceID = params.comment_reference_id.trim();
        const commentReferenceType = params.comment_reference_type;
        const defaultRecordsPerPage = [25, 50, 75, 100];
        const defaultOrderBys = {
            'comment_created_at_desc': 'Created At Desc'
        }

        if (!pageNumber && !(pageNumber > 0)) {
            pageNumber = 1;
        }

        if (!defaultRecordsPerPage.includes(recordsPerPage)) {
            recordsPerPage = 100;
        }

        if (!start || start > 0) {
            start = 0;
        }

        if (!defaultOrderBys.hasOwnProperty(orderBy)) {
            orderBy = 'comment_created_at_desc'
        }

        var JOIN = '';
        var WHERE = '';
        
        if (commentReferenceType == 'posts') {
            JOIN = ' INNER JOIN anime_social_db.posts_comments ON comments.comment_id = posts_comments.comment_id';
            WHERE = `AND posts_comments.post_id = ${commentReferenceID}`;
        }

        var query = `SELECT oauth_users.user_id, oauth_users.username, users.user_full_name, users.user_image, comments.comment_id, comments.comment_parent_id, comment_text, comment_is_spoiler, comment_is_reply, comment_replies_count, comment_likes_count, comment_dislikes_count, comment_flags_count, comment_created_at FROM anime_social_db.comments INNER JOIN anime_social_db.oauth_users ON comments.author_id = ouath_users.user_id INNER JOIN anime_social_db.users ON oauth_users.user_id = users.user_id ${JOIN} WHERE 1 = 1 ${WHERE}`;
        
        if (orderBy == 'comment_created_at_desc') {
            query += 'ORDER BY comments.comment_created_at DESC';
        }

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return results;
            }
        });
    },
    insertComment: (
        commentReferenceID,
        commentReferenceType,
        authorID,
        commentParentID,
        commentText,
        commentIsSpoiler,
        commentReplyToUserID
        ) => {
            var data = {
                'comment_reference_type': commentReferenceType,
                'author_id': authorID,
                'comment_parent_id': commentParentID,
                'comment_reply_to_user_id': commentReplyToUserID,
                'comment_text': commentText,
                'comment_is_spoiler': commentIsSpoiler,
                'comment_created_at': new Date().toISOString().split('T')[0]
            }

            var query = 'INSERT INTO anime_social_db.comments SET ?';
            var comment_id;

            connection.query(query, data, (err, results, fields) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    return comment_id = results.insertID;
                }
            });

            if (commentParentID) {
                dbSync.syncCommentRepliesCount(commentParentID);
            }

            if (commentReferenceType == 'posts') {
                data = {
                    'comment_id': comment_id,
                    'post_id': commentReferenceID
                }
                query = 'INSERT INTO anime_social_db.posts_comments SET ?';
                connection.query(query, data, (err, results, fields) => {
                    if (err) {
                        console.error(`Encountered the following error: ${err}`);
                    } else if (results.length == 0) {
                        return [];
                    } else {
                        return 'Insert was successful';
                    }
                });

                dbSync.syncPostCommentsCount(commentReferenceID);
            }
        },
    updateComment: (commentID, commentText, commentIsSpoiler) => {
        var query = `UPDATE anime_social_db.comments SET comment_text = ${commentText}, comment_is_spoile = ${commentIsSpoiler}, WHERE comment_id = ${commentID}`;
        connection.query(query, (err) => {
            if (err) console.error(err);
        });
    },
    deleteComment: (commentID, commentParentID, authorID) => {
        var query = `DELETE FROM anime_social_db.comments WHERE comment_id = ${commentID}`;
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return 'DELETE was successful'
            }
        });
        query = `UPDATE anime_social_db.comments SET comment_parent_id = '' WHERE comment_parentK_id = ${commentID}`;
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                for (result in results) {
                    return result
                }
            }
        });

        var comment = this.getCommentByID(commentID);

        if (commentParentID) {
            dbSync.syncCommentRepliesCount(commentParentID);
        }
    },
    saveCommentReaction: (userID, commentID, reaction) => {
        var query = `DELETE FROM anime_social_db.comments_reactions WHERE comment_id = ${commentID} AND user_id = ${userID}`;
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return 'DELETE reaction was successful';
            }
        });
        var data = {
            'comment_id': commentID,
            'user_id': userID,
            'reaction': reaction,
            'reaction_at': new Date().toISOString().split('T')[0]
        };
        connection.query('INSERT INTO anime_social_db.comments_reactions SET ?', data, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return 'INSERT reaction was successful'
            }
        });
        dbSync.syncCommentReactionsCount();
    }
}