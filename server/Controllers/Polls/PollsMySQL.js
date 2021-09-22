require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    checkPost: (postID, authorID) => {
        var query = `SELECT post_id, author_id FROM anime_social_db.posts WHERE post_id = ${postID} AND author_id = ${authorID} LIMIT 1`;
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
    checkPoll: (postID, authorID) => {
        var query = `SELECT post_id, author_id FROM anime_social_db.posts_polls WHERE post_id = ${postID}, authort_id = ${authorID} LIMIT 1`;
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
    getPollByID: (postID) => {
        var query = `SELECT post_id, author_id FROM anime_social_db.posts_polls WHERE post_id = ${postID} LIMIT 1`;
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
    checkVote: (postID, pollID, choiceID, userID) => {
        var query = `SELECT post_id FROM anime_social_db.posts_polls_choices_users WHERE post_id = ${postID} AND user_id = ${userID} AND choice_id = ${choiceID} AND poll_id = ${pollID} LIMIT 1`;
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
    insertPoll: (postID, pollLength, authorID) => {
        var query = 'INSERT INTO anime_social_db.posts_polls SET ?';
        var data = {
            'post_id': postID,
            'poll_length': pollLength,
            'author_id': authorID,
            'created_date': new Date().toISOString().split('T')[0]
        };
        var pollID;

        connection.query(query, data, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return pollID = results[0].insertID;
            }
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
        var choiceID;

        connection.query(query, data, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return choiceID = results[0].insertID;
            }
        });
    },
    inserVote: (userID, postID, pollID, choiceID) => {
        var query = 'INSERT INTO anime_social_db.posts_polls_choices_users SET ?';
        var data = {
            'user_id': userID,
            'post_id': postID,
            'poll_id': pollID,
            'choice_id': choiceID
        };

        connection.query(query, data, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return 'INSERT was done successfully';
            }
        });

        query = `UPDATE anime_social_db.posts_polls_choices SET anime_social_db.posts_polls_choices.count = (SELECT COUNT(anime_social_db.posts_polls_choices_users.id) FROM anime_social_db.posts_polls_choices_users WHERE anime_social_db.posts_polls_choices_users.choice_id = ${choiceID}) WHERE anime_social_db.posts_polls_choices.choice_id = ${choiceID}`;

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Encountered the following error: ${err}`);
            } else if (results.length == 0) {
                return [];
            } else {
                return 'UPDATE was done successfully';
            }
        });
    }
};