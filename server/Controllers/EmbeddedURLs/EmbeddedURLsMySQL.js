require('dotenv').config();
var mysql = require('mysql');
const dbSync = require('../DB/db');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});

module.exports = {
    getEmbeddedURLByID: (embeddedURLID) => {
        var query = `SELECT embedded_url_id, embedded_url, embedded_url_title, embedded_url_description, embedded_url_thumbnail, embedded_url_created_at FROM anime_social_db.embedded_urls WHERE embedded_url_id = ${embeddedURLID} LIMIT 1`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Enocuntered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0];
        });
    },
    insertEmbeddedURL: (embeddedURLReferenceType, embeddedURL, embeddedURLTitle, embeddedURLDescription, embeddedURLThumbnail) => {
        var data = {
            'embedded_url_reference_type': embeddedURLReferenceType,
            'embedded_url': embeddedURL,
            'embedded_url_title': embeddedURLTitle,
            'embedded_url_description': embeddedURLDescription,
            'embedded_url_thumbnail': embeddedURLThumbnail,
            'embedded_url_created_at': new Date().toISOString().split('T')[0]
        };

        var embeddedURLID;
        var query = 'INSERT INTO anime_social_db.embedded_urls SET ?';
        connection.query(query, data, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return embeddedURLID == results.insertID;
        });
    },
    deleteEmbeddedURL: (embeddedURLID) => {
        var query = `DELETE FROM anime_social_db.embedded_urls WHERE embedded_url_id = ${embeddedURLID}`;
        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return 'DELETE was successful';
        });
    }
};