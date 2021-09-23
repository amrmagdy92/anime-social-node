require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getImageByID: (imageID) => {
        var query = `SELECT image_id, image_reference_type, image_filename, image_thumbnail_filename FROM anime_social_db.images WHERE image_id = ${imageID} LIMIT 1`;
        connection.connect(query, (err, results, fields) => {
            if (err) throw err;
            if (results.length == 0) return [];
            return results[0];
        });
    },
    insertImage: (
        imageReferenceType,
        imageFilename,
        imageWidth,
        imageHeight,
        imageThumbnailFilename,
        imageThumbnailWidth,
        imageThumbnailHeight
        ) => {
            var query = 'INSERT INTO anime_social_db.images SET ?';
            var data = {
                'image_reference_type': imageReferenceType,
                'image_filename': imageFilename,
                'image_width': imageWidth,
                'image_height': imageHeight,
                'image_thumbnail_filename': imageThumbnailFilename,
                'image_thumbnail_width': imageThumbnailWidth,
                'image_thumbnail_height': imageThumbnailHeight,
                'image_created_at': new Date().toISOString().split('T')(0)
            };
            connection.query(query, data, (err, results, fields) => {
                if (err) throw err;
                if (results.length == 0) return [];
                return results.insertID;
            });
        },
    deleteImage: (imageID) => {
        var query  = `DELETE FROM anime_social_db.images WHERE image_id = ${imageID}`;
        connection.query(query, (err, results, fields) => {
            if (err) throw err;
            if (results.length == 0) return [];
            return 'DELETE was successful'
        });
    }
}