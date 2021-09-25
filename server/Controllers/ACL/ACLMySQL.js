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
    getAccessToken: (accessToken) => {
        var token = accessToken.toLowerCase();
        var query = `SELECT a.access_token, a.client_id, a.expires expired_at, b.user_id FROM anime_db.oauth_access_tokens a INNER JOIN anime_db.oauth_users b ON a.user_if = b.user_id WHERE a.access_token = ${token} LIMIT 1`;
        var row = connection.query(query, (err, results, fields) => {
            if (err) throw err;
            if (results.length == 0) return [];
            return results[0];
        });
        if (row) {
            row.platform = '';
            if (row.client_id == 'ios-app') {
                row.platform = 'iOS';
            } else if (row.client_id == 'android-app') {
                row.platform = 'Android';
            }

            if (row.user_id) {
                var userID = row.userID;
                dbSync.createUserSocialDetails(userID);
                var query = `SELECT user_per_day_limit_for_public_posts, user_per_day_limit_for_following_posts FROM users_social_details WHERE user_id = ${userID} LIMIT 1`;
                var user = connection.query(query, (err, results, fields) => {
                    if (err) throw err;
                    if (results.length == 0) return [];
                    return results[0];
                });
                row.user = user;
            }
        }

        return row;
    }
}