require('dotenv').config();
var mysql = require('mysql');
const dbSync = require('../DB/db');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getUserFlagged: (flagReferenceID, flagReferenceType, authorID) => {
        var query = `SELECT flags.flag_id FROM anime_social_db.flags LEFT OUTER JOIN anime_social_db.posts_flags ON  flags.flag_id = posts_flags.flag_id LEFT OUTER JOIN anime_social_db.comments_flags ON flags.flag_id = comments_flags.flag_id WHERE flag_reference_type = ${flagReferenceType} AND (posts_flags.post_id = ${flagReferenceID} OR comments_flags.comment_id = ${flagReferenceID}) AND flags.author_id = ${authorID}`;
        connection.query(query, (err, results, fields) => {
            if(err) console.error(err);
            if(results.length == 0) return [];
            return results[0];
        })
    },
    getReferenceObject: (flagReferenceID, flagReferenceType) => {
        var query = '';

        if (flagReferenceID && flagReferenceType == 'posts') {
            query = `SELECT post_id flag_reference_id FROM anime_social_db.posts WHERE post_id = ${flagReferenceID} LIMIT 1`;
        }

        if (flagReferenceID && flagReferenceType == 'comments') {
            query = `SELECT comment_id flag_reference_id FROM anime_social_db.comments WHERE comment_id = ${flagReferenceID} LIMIT 1`;
        }

        if (query === "") {
            return [];
        } else {
            connection.query(query, (err, results, fields) => {
                if (err) console.error(err);
                if (results.length == 0) return [];
                return results[0];
            });
        }
    },
    getFlagReasonById: (flagReasonID) => {
        var query = `SELECT flag_reason_reference_type, flag_reason_Status FROM anime_social_db.flags_reasons WHERE flag_reason_id = ${flagReasonID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(err);
            if (results.length == 0) return [];
            return results[0];
        });
    },
    insertFlag: (flagReferenceID, flagReferenceType, authorID, flagReasonID, flagExplanation) => {
        var data = {
            "flag_reference_type": flagReferenceType,
            "author_id": authorID,
            "flag_reason_id": flagReasonID,
            "flag_explanation": flagExplanation,
            "flaged_at": new Date().toISOString().split('T')[0]
        };

        if (flagReferenceType == 'posts') {
            data = {
                "flag_id": flagID,
                "post_id": flagReferenceID
            };
            var query = 'INSERT INTO anime_social_db.posts_flags SET ?';
            connection.query(query, data, (err, results, fields) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    console.log('INSERT was successful');
                }
            });
            dbSync.syncPostFlagsCount(flagReferenceID);
        }

        if (flagReferenceType === "comments") {
            data = {
                "flag_id": flagID,
                "comment_id": flagReferenceID
            }
            var query = 'INSERT INTO anime_social_db.comments_flags SET ?';
            connection.query(query, data, (err, results, fields) => {
                if (err) {
                    console.error(`Encountered the following error: ${err}`);
                } else if (results.length == 0) {
                    return [];
                } else {
                    console.log('INSERT was successful');
                }
            });
            dbSync.syncCommentFlagsCount(flagReferenceID);
        }
    }
};