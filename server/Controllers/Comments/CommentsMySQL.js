var mysql = require('mysql');
var connection = mysql.createConnection(
    // add connection config
);
connection.connect();

module.exports = {
    getReferenceObject: (commentReferenceID, commentReferenceType) => {
        // TODO: add a check on the inputs
        if(commentReferenceID && commentReferenceType) {
            var query = `SELECT post_id comment_reference_id FROM anime_db.posts WHERE post_id = ${commentReferenceID} LIMIT 1`;
            connection.query(query, (err, results, field) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    // return row
                }
            });
        }
    },
    getCommentByID: (commentID) => {
        // TODO: add a check on the inputs
        var query = `SELECT comments.comment_id, comments.author_id, comments.comment_parent_id, comment_reference_type FROM anime_db.comments WHERE comments.comment_id = ${commentID} LIMIT 1`
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                // return eligible rows
            }
        });
    },
    getComments: (params) => {
        // TODO: add a check on the inputs
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
            JOIN = ' INNER JOIN anime_db.posts_comments ON comments.comment_id = posts_comments.comment_id';
            WHERE = `AND posts_comments.post_id = ${commentReferenceID}`;
        }

        var query = `SELECT oauth_users.user_id, oauth_users.username, users.user_full_name, users.user_image, comments.comment_id, comments.comment_parent_id, comment_text, comment_is_spoiler, comment_is_reply, comment_replies_count, comment_likes_count, comment_dislikes_count, comment_flags_count, .comment_created_at FROM anime_db.comments INNER JOIN anime_db.oauth_users ON comments.author_id = ouath_users.user_id INNER JOIN anime_db.users ON oauth_users.user_id = users.user_id ${JOIN} WHERE 1 = 1 ${WHERE}`;
        
        if (orderBy == 'comment_created_at_desc') {
            query += 'ORDER BY comments.comment_created_at DESC';
        }

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                // return eligible rows
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

            var query = 'INSERT INTO anime_db.comments SET ?';
            var comment_id;

            connection.query(query, data, (err, results, fields) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    return comment_id = result.insertID;
                }
            });

            // TODO: define syncCommentRepliesCount()
            if (commentParentID) {
                syncCommentRepliesCount(commentParentID);
            }

            if (commentReferenceType == 'posts') {
                data = {
                    'comment_id': comment_id,
                    'post_id': commentReferenceID
                }
                query = 'INSERT INTO anime_db.posts_comments SET ?';
                connection.query(query, data, (err, results, fields) => {
                    if (err) {
                        console.error(`Encountered the following error: ${err}`);
                    } else if (results.length == 0) {
                        return [];
                    } else {
                        // return eligible rows
                    }
                });

                // TODO: define syncPostCommentsCount()
                syncPostCommentsCount(commentReferenceID);
            }
        },
    updateComment: () => {},
    deleteComment: () => {},
    saveCommentReaction: () => {}
}